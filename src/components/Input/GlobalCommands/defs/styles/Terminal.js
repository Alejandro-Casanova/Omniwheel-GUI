
const terminal = {
  container: {
    minHeight: '300px',
    maxWidth: '100%', // Fill parent before overflowing
    maxHeight: '100%', // Fill parent before overflowing
    borderRadius: '5px',
    overflow: 'auto',
    cursor: 'text',
    // backgroundColor: '#212121',
    //backgroundColor: '#1d1d1d',
    backgroundColor: '#000000',
    backgroundSize: 'cover'
  },
  content: {
    padding: '20px',
    height: '100%',
    fontSize: '15px',
    color: '#FFFFFF',
    fontFamily: 'monospace'
  },
  inputArea: {
    display: 'inline-flex',
    width: '100%'
  },
  promptLabel: {
    paddingTop: '3px',
    color: '#EE9C34'
  },
  inputText: {
    fontSize: '15px',
    color: '#F0BF81',
    fontFamily: 'monospace'
  },
  input: {
    border: 0,
    padding: "0 0 0 7px",
    margin: '4px 0 0 0',
    flexGrow: '100',
    width: '100%',
    height: '22px',
    background: 'transparent',
    //outline: 0, // Fix for outline showing up on some browsers
  }
  
}

export default terminal;