class UserInterface {
  #main;
  #contactForm;
  #optionsBar;
  #contactsSection;
  #searchForm;
  #searchOptions;
  #addButton;
  #addTagButton;
  #tagForm;

  constructor() {
    this.#main = document.querySelector('main');
    this.#contactForm = document.querySelector('form#new-contact-form');
    this.#optionsBar = document.querySelector('#options-bar');
    this.#searchOptions = document.querySelector('#search-categories');
    this.#contactsSection = document.querySelector('section#contacts');
    this.#searchForm = document.querySelector('#search-form');
    this.#addButton = document.querySelector('#add-contact');
    this.#addTagButton = document.querySelector('#add-tags');
    this.#tagForm = document.querySelector('#tag-form');
    this.templates = this.#initializeTemplates();
  }

  bindEvents(application) {
    document.addEventListener('submit', application.handleSubmit.bind(application));
    this.#addButton.addEventListener('click', application.displayNewForm.bind(application));
    this.#contactsSection.addEventListener('click', application.handleContactOptions.bind(application));
    this.#searchOptions.addEventListener('click', application.changeSearchCategory.bind(application));
    this.#searchForm.addEventListener('input', application.handleSearch.bind(application));
    this.#searchForm.addEventListener('keydown', application.escapeSearch.bind(application));
    this.#addTagButton.addEventListener('click', application.renderTagForm.bind(application));
    this.#tagForm.addEventListener('click', application.removeTag.bind(application));

    document.querySelectorAll('button.cancel').forEach(button => {
      button.addEventListener('click', application.refreshUI.bind(application));
    });
  }

  #initializeTemplates() {
    let templates = {};
    let handlebarsScripts = document.querySelectorAll('script[type="text/x-handlebars"]');
    let partials = document.querySelectorAll('script[data-type="partial"]');

    Array.prototype.forEach.call(handlebarsScripts, temp => {
      templates[temp.id] = Handlebars.compile(temp.innerHTML);
    });

    Array.prototype.forEach.call(partials, temp => {
      Handlebars.registerPartial(temp.id, temp.innerHTML);
    });

    return templates;
  }

  resetUI(contacts) {
    this.hide(this.#contactsSection);
    this.resetForm(this.searchForm);
    this.renderContactList(contacts);
    this.#main.replaceChildren(this.#optionsBar, this.#contactsSection);
    this.reveal(this.#contactsSection)
  }

  renderContactList(contacts) {
    let list = document.createElement('UL');
    list.classList.add('contact-list');
    list.innerHTML = this.templates['contactList']({contacts: contacts});
    this.#contactsSection.replaceChildren(list);
  }

  renderContactForm(tagList) {
    this.hide(this.contactForm);
    this.resetForm(this.contactForm);
    this.contactForm.dataset.type = 'new';

    this.contactForm['tags'].innerHTML = this.templates['tagSelection']({tags: [...tagList]});
    this.#main.replaceChildren(this.contactForm);
    this.reveal(this.contactForm);
  }

  renderEditForm(data, tagList) {
    this.hide(this.contactForm);

    this.#insertContactFormData(data, tagList);
    this.contactForm.dataset.id = data['id'];
    this.contactForm.dataset.type = 'edit';

    this.#main.replaceChildren(this.#contactForm);
    this.reveal(this.contactForm);
  }

  #insertContactFormData(data, tagList) {
    this.contactForm['full_name'].value = data['full_name'];
    this.contactForm['phone_number'].value = data['phone_number'];
    this.contactForm['email'].value = data['email'];
    this.contactForm['tags'].innerHTML = this.templates['tagSelection']({tags: [...tagList]});
    this.#markSelectedTags(data['tags']);
  }

  renderTagForm(tagList) {
    this.hide(this.tagForm);
    this.renderTagFormList([...tagList]);
    this.reveal(this.#tagForm);
  }

  renderTagFormList(tags) {
    let list = this.#tagForm.querySelector('ul');
    list.innerHTML = this.templates['tagFormList']({tags: tags});
    this.#main.replaceChildren(this.#tagForm);
  }

  #markSelectedTags(tags) {
    this.#contactForm.querySelectorAll('option').forEach(option => {
      if (tags.includes(option.value)) {
        option.selected = true;
      }
    });
  }

  resetForm(form) {
    form.reset();
  }

  updateSearchBar() {
    let category = this.#searchForm['search-filter'].value;
    this.#searchForm['search-term'].placeholder = `Search by ${category}`;
  }

  get contactForm() {
    return this.#contactForm;
  }

  get tagForm() {
    return this.#tagForm;
  }

  get searchForm() {
    return this.#searchForm;
  }

  hide(element) {
    $(element).hide();
  }

  reveal(element) {
    $(element).slideDown();
  }
}

export {UserInterface};
