import './src/utils/setImmediatePolyfill';
import { registerRootComponent } from 'expo';
import App from './App';

const errorHandler = (error) => {
  console.error('Application Error:', error);
};

global.ErrorUtils.setGlobalHandler(errorHandler);

registerRootComponent(App);