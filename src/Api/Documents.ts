import axios from "axios";

const FindDocumentByid = async (id: string) => {
    return await axios.get(`http://localhost:4000/api/v1/documents/${id}`, {withCredentials: true} );
};

export {FindDocumentByid}