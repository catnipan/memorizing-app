import gql from 'graphql-tag';

export const GetUserInfoQuery = gql`
  query GetUserInfo {
    userInfo {
      Email
    }
  }
`;

export const LoginUserMutation = gql`
  mutation LoginMutation($email: String!, $password: String!){
    LoginUser(email: $email, password: $password) 
  }
`;

export const SignUpAndLogInMutation = gql`
  mutation SignUpAndLogInMutation($email: String!, $password: String!){
    CreateUser(email: $email, password: $password)
    LoginUser(email: $email, password: $password)
  }
`;

export const LogOutMutation = gql`
  mutation LogOutMutation {
    LogoutUser
  }
`;

export const CreateMemoMutation = gql`
  mutation CreateMemoMutation($title: String!, $content: String!) {
    CreateMemo(title: $title, content: $content) {
      Content,
      CreatedAt,
      MemoId,
      Round,
      Schedule,
      Stage,
      Title
    }
  }
`;

export const TickMemoMutation = gql`
  mutation TickMemoMutation($memoId: ID!) {
    TickMemo(memoId: $memoId) {
      MemoId
      Round
      Stage
      Schedule
    }
  }
`

export const RescheduleMemoMutation = gql`
  mutation RescheduleMemoMutation($memoId: ID!) {
    ReSchedule(memoId: $memoId) {
      MemoId
      Round
      Stage
      Schedule
    }
  }
`

export const GetAllMemoQuery = gql`
  query GetAllMemos {
    memos {
      MemoId
      Title
      Content
      CreatedAt
      Round
      Stage
      Schedule
    }
  }
`;

export const ClientTimeQuery = gql`
  query ClientTimeQuery {
    clientNow @client
  }
`;

export const ServerTimeQuery = gql`
  query ServerTimeQuery {
    serverNow: now
  }
`;