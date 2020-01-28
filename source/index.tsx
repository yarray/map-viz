import { documentReady, render, createCell } from 'web-cell';
import { OpenlayersMapViz } from './page/OpenlayersMapViz';

documentReady.then(() => render(<OpenlayersMapViz />));
