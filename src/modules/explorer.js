import { $, $$ } from 'select-dom';
import { on, addClass, removeClass } from 'utils/helpers';

const explorer = (el) => {
  const tabs = $$('.js-explorer-tab', el);
  const contents = $$('.js-explorer-content', el);

  const unselectAllTabs = () => {
    removeClass(tabs, 'active');
    removeClass(contents, 'active');
  }

  const selectActiveTab = (tab, content) => {
    addClass(content, 'active');
    addClass(tab, 'active');
  }

  const initExplorer = () => {
    selectActiveTab(tabs[0], contents[0]);
  }

  tabs.forEach((item) => {
    on(item, 'click', (e) => {
      const slug = item.getAttribute('data-content');
      const content = $(`.js-explorer-content[data-tab="${slug}"]`, el);
      unselectAllTabs();
      selectActiveTab(item, content);
    });
  });

  initExplorer();
}

export default explorer;