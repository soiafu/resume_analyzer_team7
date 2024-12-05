import backgroundImg from '../background3.png';

const styles = {
    background: {
      backgroundImage: `url(${backgroundImg})`,
      backgroundColor: '#000000',
      backgroundSize: 'cover', 
      backgroundRepeat: 'no-repeat', 
      height: '150vh', 
      width: '100%', 
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
    wordcount: {
      fontSize: '15px',
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
        marginTop: '20px', 
        width: '200px',
        height: '200px',
        margin: '0 auto',
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
      flexDirection: 'column', 
      gap: '10px', 
      width: '100%',
  },
    textarea: {
        width: '100%', 
        padding: '10px',
        margin: '0', 
    },
    resultsButton: {
      width: '100%', 
      padding: '10px 20px',
      backgroundColor: '#942101',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    button: {
        width: '100%', 
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
    loaderContainer: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    

    container: {
      width: '90%',
      maxWidth: '800px',
      padding: '30px',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
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
        boxShadow: '0 8px 24px rgba(50, 50, 50, 0.2)', // Transparent dark gray shadow
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
    }
    
  };
  
  export default styles;
  