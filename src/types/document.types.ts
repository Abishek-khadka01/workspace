 export type DocumentTypeFromS = {

    _id : string ,
    name : string ,
    updatedAt : Date,
    members :[{
        _id : string,
        username : string,
        profilepicture : string
    }]

}


export type TypeMembers = {
    _id : string ,
    username: string ,
    profilepicture: string

}