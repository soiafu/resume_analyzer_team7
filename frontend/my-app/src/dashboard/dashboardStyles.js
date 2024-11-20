import backgroundImg from '../background3.png';

const styles = {
    body: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url(${backgroundImg})`,
      fontFamily: '"Lato", sans-serif',
    },
    container: {
      width: '90%',
      maxWidth: '800px',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#fff',
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
  };
  
  export default styles;
  