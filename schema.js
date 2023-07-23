import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList} from 'graphql';
import { columns } from './data.js';

const CardType = new GraphQLObjectType({
    name: 'Card',
    description: 'This represents a card in the kanban board',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString }
    })
});

const ColumnType = new GraphQLObjectType({
    name: 'Column',
    description: 'This represents a column',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        cards: { type: new GraphQLList(CardType) }
    })
});

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'This is a root query',
        fields: () => ({
            columns: {
                type: new GraphQLList(ColumnType),
                resolve: () => columns
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        description: 'This is a root mutation',
        fields: () => ({
            createColumn: {
                type: ColumnType,
                args: {
                    title: { type: GraphQLString }
                },
                resolve: (_, { title }) => {
                    const newColumn = {
                        id: String(columns.length + 1),
                        title,
                        cards: []
                    };
                    columns.push(newColumn);
                    return newColumn;
                }
            },
            updateColumn: {
                type: ColumnType,
                args: {
                    id: { type: GraphQLString },
                    title: { type: GraphQLString }
                },
                resolve: (_, { id, title }) => {
                    const columnIndex = columns.findIndex((column) => column.id === id);
                    if (columnIndex === -1) {
                        throw new Error(`Column with id ${id} not found.`);
                    }
                    columns[columnIndex].title = title;
                    return columns[columnIndex];
                }
            },
            deleteColumn: {
                type: GraphQLString,
                args: {
                    id: { type: GraphQLString }
                },
                resolve: (_, { id }) => {
                    const columnIndex = columns.findIndex((column) => column.id === id);
                    if (columnIndex === -1) {
                        throw new Error(`Column with id ${id} not found.`);
                    }
                    columns = columns.filter((column) => column.id !== id);
                    return `Column with id ${id} deleted successfully.`;
                }
            },
            createCard: {
                type: CardType,
                args: {
                    columnId: { type: GraphQLString },
                    title: { type: GraphQLString },
                    description: { type: GraphQLString }
                },
                resolve: (_, { columnId, title, description }) => {
                    const columnIndex = columns.findIndex((column) => column.id === columnId);
                    if (columnIndex === -1) {
                        throw new Error(`Column with id ${columnId} not found.`);
                    }
                    const newCard = {
                        id: String(columns[columnIndex].cards.length + 1),
                        title,
                        description
                    };
                    columns[columnIndex].cards.push(newCard);
                    return newCard;
                }
            },
            updateCard: {
                type: CardType,
                args: {
                    columnId: { type: GraphQLString },
                    cardId: { type: GraphQLString },
                    title: { type: GraphQLString },
                    description: { type: GraphQLString }
                },
                resolve: (_, { columnId, cardId, title, description }) => {
                    const columnIndex = columns.findIndex((column) => column.id === columnId);
                    if (columnIndex === -1) {
                        throw new Error(`Column with id ${columnId} not found.`);
                    }
                    const cardIndex = columns[columnIndex].cards.findIndex((card) => card.id === cardId);
                    if (cardIndex === -1) {
                        throw new Error(`Card with id ${cardId} not found.`);
                    }
                    columns[columnIndex].cards[cardIndex].title = title;
                    columns[columnIndex].cards[cardIndex].description = description;
                    return columns[columnIndex].cards[cardIndex];
                }
            },
            deleteCard: {
                type: GraphQLString,
                args: {
                    columnId: { type: GraphQLString },
                    cardId: { type: GraphQLString }
                },
                resolve: (_, { columnId, cardId }) => {
                    const columnIndex = columns.findIndex((column) => column.id === columnId);
                    if (columnIndex === -1) {
                        throw new Error(`Column with id ${columnId} not found.`);
                    }
                    const cardIndex = columns[columnIndex].cards.findIndex((card) => card.id === cardId);
                    if (cardIndex === -1) {
                        throw new Error(`Card with id ${cardId} not found.`);
                    }
                    columns[columnIndex].cards = columns[columnIndex].cards.filter((card) => card.id !== cardId);
                    return `Card with id ${cardId} deleted successfully.`;
                }
            }
        })
    })
});