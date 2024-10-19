import { buildSchema } from "graphql";

export default buildSchema(`
     
    type User {
        name :String,
        _id:ID!
        email:String!
        groupNo: String!

        evaluationMarks:String!
    }
    input projectInput {
        
        projectTitle: String!
        ProjectDescription:String!
    }
    input GroupMemberInput{
        memberDetails: String!

    }

    type ProjectData {
        title: String!
        description:String!
    }
    
    type GroupData {
        groupId: String!
    }

    type RootQuery { 
        logIn(email:String!, pasword: String!): User!
        getProject( userId :String!):ProjectData!
        getAllProjects: [ProjectData]!
    }

    type RootMutation { 
        createUsers(email:String!,password:String!):String!
        createProject(projectInput:ProjectData):String!
        createGrop(GroupMemberInput: GroupData):String!
          }

    schema {
        query: RootQuery
        mutation: RootMutation
    }


`);
