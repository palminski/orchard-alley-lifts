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
    const [errorMessage, setErrorMessage] = useState("");

    //===[Queries]=============================================
    const {loading,data,refetch} = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser);
    
    //===[Mutations]=============================================
    const [updatePassword] = useMutation(UPDATE_PASSWORD);

    //===[Functions]=============================================
    const handleFormChange = (event) => {
        const {name,value} = event.target;
        setErrorMessage("");
        setFormState({
            ...formState,
            [name]:value   
        });
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        // console.log(formState);

        try {
            const mutationResponse = await updatePassword({
                variables: {
                    password: formState.currentPassword,
                    newPassword: formState.newPassword,
                }
            });
            setErrorMessage("Password Changed Succesfully!");
        }
        catch (error) {
            setErrorMessage("Password Incorrect");
            console.log(error);
        }
    }

    //===[Return]=========================================
    return (
       <div className="mypage-container">
        {
                user &&
                <>
                    <h1 className="mypage-title">{user.username}</h1>
                    <div className="mypage-form-container">
                    <form className="mypage-container" onSubmit={handleFormSubmit}>
                        <h3 className="mypage-form-title">Change Password</h3>
                        <div>
                        <label htmlFor="currentPassword">Current Password: </label>
                        <input name="currentPassword" type="password" id="currentPassword" onChange={handleFormChange} value={formState.currentPassword} />
                        </div>
                        <div>
                        <label htmlFor="newPassword">New Password: </label>
                        <input name="newPassword" type="password" id="newPassword" onChange={handleFormChange} value={formState.newPassword} />
                        {errorMessage && <p>{errorMessage}</p>}
                        </div>
                        <button>Submit</button>
                    </form>
                    </div>
                </>
            }

        </div>
    )
}

export default MyPage;