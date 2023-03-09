import { useQuery, useMutation } from "@apollo/client";
import {QUERY_CURRENT_USER} from '../utils/queries';
import { UPDATE_PASSWORD } from "../utils/mutations";
import {useState} from 'react';

const MyPage = () => {
    //===[States]=============================================
    const [formState, setFormState] = useState({
        currentPassword: "",
        newPassword: "",
    });

    //===[Queries]=============================================
    const {loading,data,refetch} = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser);
    
    //===[Mutations]=============================================
    const [updatePassword] = useMutation(UPDATE_PASSWORD);

    //===[Functions]=============================================
    const handleFormChange = (event) => {
        const {name,value} = event.target;
        setFormState({
            ...formState,
            [name]:value   
        });
    }

    async function handleFormSubmit(event) {
        // event.preventDefault();
        // console.log(formState);

        try {
            const mutationResponse = await updatePassword({
                variables: {
                    password: formState.currentPassword,
                    newPassword: formState.newPassword,
                }
            });
            
        }
        catch (error) {
            console.log(error);
        }
    }

    //===[Return]=========================================
    return (
       <div>
        {
                user &&
                <>
                    <h1>{user.username}</h1>
                    <form onSubmit={handleFormSubmit}>
                        <h3>Change Password</h3>
                        <label htmlFor="currentPassword">Current Password: </label>
                        <input name="currentPassword" type="password" id="currentPassword" onChange={handleFormChange} value={formState.currentPassword} />
                        <label htmlFor="newPassword">New Password: </label>
                        <input name="newPassword" type="password" id="newPassword" onChange={handleFormChange} value={formState.newPassword} />
                        <button>Submit</button>
                    </form>
                </>
            }

        </div>
    )
}

export default MyPage;