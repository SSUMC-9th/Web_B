import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent(){

        const {theme, toggleTheme}=useTheme();
    
        const isLightMode = theme ===THEME.LIGHT;
    

  return (
    <div className={clsx(
        'p-4 h-dvh w-full', isLightMode ? 'bg-white' : 'bg-gray-800'
    )}
    >
        <h1 className={clsx(
            'text-3xl font-bold', isLightMode? 'text-black':'text-white'
        )}>
            theme Content
         </h1>
        <p className={clsx('mt-2', isLightMode ? 'text-black': 'text-white')}
        >
            First, verify that your componentWillUnmount does the opposite of componentDidMount. In the above example, that’s true: it disconnects the connection that componentDidMount sets up. If such logic is missing, add it first.

Next, verify that your componentDidUpdate method handles changes to any props and state you’re using in componentDidMount. In the above example, componentDidMount calls setupConnection which reads this.state.serverUrl and this.props.roomId. This is why componentDidUpdate checks whether this.state.serverUrl and this.props.roomId have changed, and resets the connection if they did. If your componentDidUpdate logic is missing or doesn’t handle changes to all relevant props and state, fix that first.

In the above example, the logic inside the lifecycle methods connects the component to a system outside of React (a chat server). To connect a component to an external system, describe this logic as a single Effect:
        </p>

       
      

    </div>
  )
}
