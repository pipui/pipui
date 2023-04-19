class TabsComponent {
	static VERSION = '2.0.0';

	static debug = false;

	static #lock = false;

	static active = e => {
		let id = e.getAttribute('data-tabs-id');

		if(TabsComponent.#lock || typeof id != 'string'){
			if(PipUI.Logger && TabsComponent.debug){
				PipUI.Logger.info(PipUI.i18n().get('tabs.d_lock'), TabsComponent.#lock, id);
			}

			return false;
		}

		let tabs = e.closest('.tabs');

		let links = PipUI.children(tabs, '.tab-links')[0];

		let list = PipUI.children(tabs, '.tab-list')[0];

		let currentTrigger = links.querySelector('.tab-link.active');

		let currentTarget = PipUI.children(list, '.tab-id.active')[0];

		if(currentTrigger.getAttribute('data-tabs-id') == id){ return false; }

		let nextTrigger = links.querySelector('.tab-link[data-tabs-id="'+id+'"]');

		let nextTarget = PipUI.children(list, '.tab-id[data-tabs-id="'+id+'"]')[0];

		if(typeof nextTarget == 'undefined'){
			if(PipUI.Logger && TabsComponent.debug){
				PipUI.Logger.info(PipUI.i18n().get('tabs.d_next_undefined'));
			}

			return false;
		}

		TabsComponent.#lock = true;


		PipUI.removeClass(currentTarget, 'active');

		PipUI.removeClass(currentTrigger, 'active');

		PipUI.trigger(currentTarget, 'hide-tabs-pipui', nextTarget, nextTrigger, currentTarget, currentTrigger);

		if(PipUI.Logger && TabsComponent.debug){
			PipUI.Logger.info(PipUI.i18n().get('tabs.d_active_start_complete'));
		}

		PipUI.addClass(nextTarget, 'active');

		PipUI.addClass(nextTrigger, 'active');

		PipUI.trigger(nextTarget, 'show-tabs-pipui', nextTarget, nextTrigger, currentTarget, currentTrigger);

		if(PipUI.Logger && TabsComponent.debug){
			PipUI.Logger.info(PipUI.i18n().get('tabs.d_active'), tabs);
		}

		TabsComponent.#lock = false;

		return true;
	}
}

PipUI.ready(document, () => {
	if(PipUI.Logger && TabsComponent.debug){
		PipUI.Logger.info(PipUI.i18n().get('tabs.d_init'));
	}

	PipUI.body('click', '.tabs .tab-link[data-tabs-id]', (e, target) => {
		e.preventDefault();

		TabsComponent.active(target);
	});
});

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Tabs', TabsComponent.VERSION);
	PipUI.required('Tabs', 'Animations', '1.0.0', '>=');
	/** @return {TabsComponent} */
	PipUI.Tabs = TabsComponent;

	PipUI.i18n()
		.set('tabs.d_lock', '[Tabs] Активация заблокирована из-за отсутсвия идентификатора или незаконченности анимации')
		.set('tabs.d_init', '[Tabs] Инициализация событий')
		.set('tabs.d_active', '[Tabs] Активация вкладки')
		.set('tabs.d_next_undefined', '[Tabs] Выбранный элемент не найден. Активация заблокирована')
		.set('tabs.d_active_start_complete', '[Tabs] Анимация скрытия завешена');
}