// Query
const mutationQuery = `
query{
  games {
    id,
        players{id, host}, 
  }
}
`;

// URL of your GraphQL server
const graphqlUrl = 'http://localhost:4000/graphql';

const your_auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbjFAYmF0dGxlc2hpcC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRwS0tCU0RrQnJkY01GRUp2bTB0WlRlelNQTGNlbVBwZVJaSmczU2VER3FTQUxZMlZaRkw4eSIsIm51bWJlck9mV2lucyI6MiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xMDBaIiwiaWF0IjoxNjg1NjU2OTY3fQ.Lr4PdT523bR1E9WyCBcocX6jKyNRoHkcCjMrj_GDNuw"
// Use fetch API to send the mutation
fetch(graphqlUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${your_auth_token}` // if you use authorization
  },
  body: JSON.stringify({
    query: mutationQuery,
  }),
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      console.error("There were errors in the GraphQL query:", data.errors);
    } else {
      console.log(JSON.stringify(data));
    }
  })
  .catch(error => console.error('Error:', error));