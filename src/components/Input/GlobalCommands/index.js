import React from 'react'
import Terminal from "./Terminal.jsx"

const commands = {
    echo: {
        description: 'Echo a passed string.',
        usage: 'echo <string>',
        fn: (...args) => args.join(' ')
    }
}

const GlobalCommands = () => {
    
    return (
        <Terminal
            commands={commands}
            welcomeMessage={'Welcome to the Omniwheel Global Commands Terminal!'}
            promptLabel={'~$'}
            background-size="100% 100%"
            
        />
    )
     
}

export default GlobalCommands;