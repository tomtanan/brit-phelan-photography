import 'scripts/init';
import 'styles/main.css';
import { $, $$ } from 'select-dom';
import { isTouchDevice, removeClass, splitIntoWords } from 'utils/helpers';

splitIntoWords($$('.js-text-beautifier'));

if (isTouchDevice()) removeClass($('body'), 'no-touch');