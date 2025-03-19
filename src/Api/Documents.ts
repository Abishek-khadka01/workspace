import axios from "axios";

const FindDocumentByid = async (id: string) => {
    return  axios.get(`http://localhost:4000/api/v1/documents/find/${id}`, {withCredentials: true} );
};


const AllDocumentsApi  = async ()=>{
    return axios.get(`http://localhost:4000/api/v1/documents/find`, {
        withCredentials : true
    })

}


const CreateDocumentApi  = async (name : string )=>{
    return axios.post(`http://localhost:4000/api/v1/documents/create-document`, {
        name,
    }, {
        withCredentials : true
    })
}

const DocumentContentUpdate = async (documentID : string ,message : string )=>{
    return axios.patch(`http://localhost:4000/api/v1/documents/update-document`, {
        id : documentID,
        message  // the message is the content of the document updated 
    }, {
        withCredentials: true
    })
}



const DeleteDocument = async (documentID : string )=>{
    return await axios.delete(`http://localhost:4000/api/v1/documents/delete-document/${documentID}`, {
        withCredentials : true
})
}

export {FindDocumentByid, AllDocumentsApi, CreateDocumentApi, DocumentContentUpdate, DeleteDocument}