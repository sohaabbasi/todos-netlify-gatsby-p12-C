// Importing Faunadb in our Server
const faunadb = require("faunadb")
// Creating a query instance
q = faunadb.query

const { ApolloServer, gql } = require("apollo-server-lambda")

const typeDefs = gql`
  type Query {
    items: [Items]
  }

  type Mutation {
    addTask(message: String!): String
    removeTask(id: String!): String
  }

  type Items {
    id: String
    item: String
  }
`

const resolvers = {
  Query: {
    items: async (parent, args, context) => {
      try {
        const client = new faunadb.Client({
          secret: "fnAD9dwMc-ACAd31sYeV5aangf9pL7akbRaJvHWa",
        })
        let result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("Todo"))),
            q.Lambda(X=> q.Get(X))
          )
        )

        
        const data = result.data.map((d) => {
            console.log(d.data.item)
            return {
              id: d.ref.id,
              item: d.data.item,
            }
        })
        return data

      } catch (error) {
        return error.toString()
      }
    },
  },

  Mutation: {
    addTask: async (_, { message }) => {
      try {
        const client = new faunadb.Client({
          secret: "fnAD9dwMc-ACAd31sYeV5aangf9pL7akbRaJvHWa",
        })

        let result = await client.query(
          q.Create(q.Collection("TodoList"), { data: { item: message } })
        )
        console.log(result)
        return result.ts.toString()
      } catch (error) {
        return error.toString()
      }
    },

    removeTask: async (_, { id }) => {

        console.log(id)

      try {
        const client = new faunadb.Client({
          secret: "fnAD9dwMc-ACAd31sYeV5aangf9pL7akbRaJvHWa",
        })
        



        let result = await client.query(
          q.Delete(q.Ref(q.Collection("TodoList"), id))
        )

        return result.id.toString()
      } catch (error) {
        return error.toString()
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
