import { RequestManager } from "./RequestManager.js";
import { UserInterface } from "./userInterface.js";
import { ContactList } from "./contactList.js";

class Application {
  #contacts;

  constructor() {
    this.requests = new RequestManager();
    this.UI = new UserInterface ();
    this.contactForm = this.UI.contactForm;
    this.searchForm = this.UI.searchForm;
    this.tagForm = this.UI.tagForm;
  }
  
  start() {
    this.UI.bindEvents(this);
    this.loadContacts().then(() => this.refreshUI());
  }

  async loadContacts() {
    let list = await this.requests.getContacts();
    this.#contacts = new ContactList(list);
    return this.#contacts;
  }

  refreshUI() {
    this.UI.resetUI(this.#contacts.list);
  }

  displayNewForm() {
    this.UI.renderContactForm(this.#contacts.tags);
  }

  async renderEditForm(id) {
    try {
      let contactData = await this.requests.fetchContact(id);
      this.UI.renderEditForm(contactData, this.#contacts.tags);
    } catch (error) {
      alert(error);
    }
  }

  renderTagForm() {
    this.UI.renderTagForm(this.#contacts.tags);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (event.target === this.contactForm) {
      this.saveContact(this.contactForm.dataset.type);
    } else if (event.target === this.tagForm) {
      this.saveTag();
    }
  }

  saveContact(saveType) {
    if (saveType === "new") {
      this.addNewContact();
    } else if (saveType === "edit") {
      this.editContact(Number(this.contactForm.dataset.id));
    }
  }

  async addNewContact() {
    try {
      let contactData = this.prepareContactData();
      let responseData = await this.requests.createContact(contactData);
      this.#contacts.add(responseData);
      this.refreshUI();
    } catch (error) {
      alert(error);
    }
  }

  async editContact(id) {
    try {
      let contactData = this.prepareContactData();
      let response = await this.requests.editContact(id, contactData);
      this.#contacts.update(id, response);
      this.refreshUI();
    } catch (error) {
      alert(error);
    }
  }

  prepareContactData() {
    let contactData = this.pullContactData();
    this.#contacts.validateContact(contactData);
    return contactData;
  }

  pullContactData() {
    let contactData = {};
    let parsedData = new FormData(this.contactForm);

    parsedData.forEach((value, key) => {
      if (key !== 'tags') {
        contactData[key] = value.trim();
      }
    });

    contactData['tags'] = parsedData.getAll('tags').join(',');
    return contactData;
  }

  saveTag() {
    try {
      let tagData = this.tagForm['tag'].value;
      this.#contacts.validateTag(tagData);
      this.#contacts.tags.add(tagData);
      this.UI.renderTagFormList([...this.#contacts.tags]);
      this.UI.resetForm(this.tagForm);
    } catch (error) {
      alert(error);
    }
  }

  async removeTag(event) {
    if (event.target.tagName === 'SPAN') {
      event.preventDefault();

      let tag = event.target.textContent;
      
      if (confirm('This will remove the tag from all contacts')) {
        try {
          await this.deleteTag(tag);
          this.#contacts.tags.delete(tag)
          this.refreshUI();
        } catch (error) {
          alert(error);
        }
      }
    }
  }

  deleteTag(delTag) {
    let edits = this.#contacts.filterByTag(delTag);

    edits = edits.map(contact => {
      return {
        id: contact.id,
        tags: contact.tags.filter(tag => tag !== delTag).join(',')
      };
    });

    let requests = this.updateMultiContacts(edits);
    return Promise.all(requests);
  }

  updateMultiContacts(contactList) {
    return contactList.map(contact => {
      return this.requests.editContact(contact.id, contact)
        .then(data => this.#contacts.update(contact.id, data));
    });
  }

  handleContactOptions(event) {
    event.preventDefault();

    if (event.target.tagName === 'BUTTON') {
      if (event.target.dataset.type === 'delete') {
        this.deleteContact(Number(event.target.dataset.id));
      } else {
        this.renderEditForm(Number(event.target.dataset.id));
      }
    } else if (event.target.tagName === 'SPAN') {
      this.autoSearch(event.target.textContent);
    }
  }

  async deleteContact(id) {
    if (confirm('Are you sure you want to delete?')) {
      try {
        await this.requests.deleteContact(id);
        this.#contacts.remove(id);
        this.refreshUI();
      } catch (error) {
        alert(error);
      }
    }
  }

  handleSearch(event) {
    event.preventDefault();

    let filter = this.searchForm['search-filter'].value;
    let searchTerm = this.searchForm['search-term'].value;

    let filteredList = this.searchContacts(filter, searchTerm);
    this.UI.renderContactList(filteredList);
  }

  searchContacts(filter, searchTerm) {
    if (filter === 'name') {
      return this.#contacts.filterByName(searchTerm);
    } else if (filter === 'tag') {
      return this.#contacts.filterByTag(searchTerm);
    } else {
      alert('no category');
      return false;
    }
  }

  escapeSearch(event) {
    if (event.key === 'Escape') {
      this.UI.resetForm(this.searchForm)
      this.searchForm.dispatchEvent(new Event('input'));
    }
  }

  autoSearch(tag) {
    this.searchForm['search-filter'].value = 'tag';
    this.searchForm['search-term'].value = tag;
    this.searchForm.dispatchEvent(new Event('input'));
  }

  changeSearchCategory(event) {
    if (event.target.type === 'radio') {
      this.UI.updateSearchBar();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new Application().start(); 
});