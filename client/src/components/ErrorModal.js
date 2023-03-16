const ErrorModal = (props) => {
    
    const {errorMessage} = props;

    return (
        <>
        <h1>An Error has Occured</h1>
        <p>{errorMessage}</p>
        </>
    )
}
export default ErrorModal;