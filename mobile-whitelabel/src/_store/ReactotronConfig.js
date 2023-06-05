import Reactotron from 'reactotron-react-native';
// import sagaPlugin from 'reactotron-redux-saga';
import { reactotronRedux } from 'reactotron-redux';

Reactotron.configure({ name: 'ERIN', host: "192.168.1.8" })
    .useReactNative()
    .use(reactotronRedux())
    .connect();

const oldConsoleLog = console.log;
console.log = (...args) => {
    oldConsoleLog(...args);
    // send this off to Reactotron.
    Reactotron.display({
        name: 'CONSOLE',
        value: args,
        preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
    });
};

export default Reactotron;
