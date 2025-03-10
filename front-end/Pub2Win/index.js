// Import polyfill first
import './src/utils/setImmediatePolyfill';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);