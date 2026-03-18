import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
 schema: [
    {
      'http://localhost:8081/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'mysecretkey', // 👈 use your actual secret
          'content-type': 'application/json',
        },
        method: 'POST',
      },
    },
  ],
  documents: './src/graphql/*.gql',
  generates: {
    './src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular'
      ],
      config: {
        withHooks: false,
        apolloClientVersion: 4,
        apolloAngularVersion: 4,
        },
      }
  }
}
export default config