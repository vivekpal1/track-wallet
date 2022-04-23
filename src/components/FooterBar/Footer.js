import classes from "./Footer.module.css";
import GithubIcon from "../../icons/footer/github.svg";

const Footer = () => {
  return (
    <footer className={classes.footer}>
    
      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        alt="github"
      >
        <img src={GithubIcon} alt="github" />
      </a>
      
    </footer>
  );
};

export default Footer;
