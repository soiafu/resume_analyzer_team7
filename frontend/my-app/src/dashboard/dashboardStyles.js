import backgroundImg from '../background3.png';

const styles = {
    background: {
      backgroundImage: `url(${backgroundImg})`,
      backgroundColor: '#bf2b02',
      backgroundSize: 'cover', // Ensures the image covers the element
      backgroundRepeat: 'no-repeat', // Avoid repeats
      height: '100vh', // Full viewport height
      width: '100%', // Full width
    },

    body: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Lato", sans-serif',
    },
    
    title: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#333',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#333',
    },
    circularProgressContainer: {
        marginTop: '20px', // Adjust spacing between title/paragraph and progress bar
        width: '200px',
        height: '200px',
        margin: '0 auto', // Center the progress bar
      },
    listItem: {
      fontSize: '16px',
      marginBottom: '8px',
      borderRadius: '6px',
      backgroundColor: '#f8f9fa',
    },
    overview: {
      display: 'flex', 
      backgroundImage: `url(${backgroundImg})`,
      justifyContent: 'spaceBetween',
    },
    form: {
      display: 'flex',
      flexDirection: 'column', // Stack elements vertically
      gap: '10px', // Adds space between elements
      width: '100%',
  },
    textarea: {
        width: '100%', // Ensure textarea fills the width of the form
        padding: '10px',
        margin: '0', // Remove any default margins that might cause unwanted spacing
    },
    button: {
        width: '100%', // Ensure button fills the width of the form
        padding: '10px 20px',
        backgroundColor: '#040a06',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginBottom: '10px',
    },

    container: {
      width: '90%',
      maxWidth: '800px',
      padding: '30px',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center', // Centers children vertically
      margin: 'auto'
    },
    leftContainer: {
      flex: 1,
      padding: '20px',
    },
    rightContainer: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        padding: '20px',
        flexDirection: 'row',
    },
    containerResume: {
        flex: 1,
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(240, 240, 240, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '20px',
    },
    containerDescription: {
        flex: 1,
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(240, 240, 240, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '20px',
    },
  };
  
  export default styles;
  