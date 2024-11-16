import backgroundImg from './background3.png';

const styles = {
  body: {
    backgroundImage: `url(${backgroundImg})`,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightback: {
    flex: '1',
    backgroundColor: '#040a06',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftback: {
    flex:'1',
    backgroundColor: '#bf2b02',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContainerStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "10px",
    margin: "20px",
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.95)',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px',
    width: '100%',
    margin: '0 auto', 
    fontFamily: '"Lato", sans-serif',
    boxSizing: 'border-box', 
    paddingRight: '50px',
},

  title: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '32px',
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#bf2b02',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  createAccountButton: {
    padding: '12px',
    fontSize: '16px',
    color: '#007bff',
    backgroundColor: '#e9ecef',
    border: '1px solid #007bff',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
};

export default styles;
