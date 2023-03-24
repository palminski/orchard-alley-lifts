import { useApolloClient } from "@apollo/client";

const Footer = () => {
  const client = useApolloClient();
  return (
    <>
      <footer className="footer-container">
        <a href="https://github.com/palminski" className="github-links">Will's Github</a>
        <a href="https://github.com/deand925" className="github-links">Dean's Github</a>
      </footer>
    </>
  );
};

export default Footer;