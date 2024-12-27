class ContactList {
  #list
  #tags

  constructor(contactsArray) {
    this.#tags = new Set();
    this.#list = [];
    
    
    contactsArray.forEach(contact => {
      this.add(contact);
    });
  }

  add(contact) {
    this.#formatTags(contact);
    this.#addTagsToTagSet(contact);

    this.#list.push(contact);
    return this.#list;
  }

  remove(id) {
    let index = this.#list.findIndex(contact => {
      return contact.id === id;
    });

    this.#list.splice(index, 1);
    return this.#list;
  }

  update(id, contactData) {
    let index = this.#list.findIndex(contact => {
      return contact.id === id;
    });

    this.#formatTags(contactData);
    this.#list[index] = contactData;
  }

  filterByName(searchQuery) {
    let pattern = new RegExp(`^.*${searchQuery}.*$`, 'i');

    return this.#list.filter(contact => pattern.test(contact['full_name']));
  }

  filterByTag(searchQuery) {
    let pattern = new RegExp(`^.*${searchQuery}.*$`, 'i');

    return this.#list.filter(contact => {
      return contact['tags'].some(tag => pattern.test(tag));
    });
  }

  validateName(name) {
    let minLength = 1;
    let maxLength = 50;
    if (name.length < minLength) {
      throw Error("Full name must have at least 1 non-whitespace character");
    } else if (name > maxLength) {
      throw Error("Full name must be less than 50 characters");
    }
  }

  validatePhone(phone) {
    let pattern = /[0-9]{10}/;

    if (!pattern.test(phone)) {
      throw Error('phone number must contain 10 digits');
    }
  }

  validateEmail(email) {
    let pattern = /^([A-Za-z0-9]+)@([A-Za-z0-9]+)(\.[A-Za-z]+)+$/;
    if (!pattern.test(email)) {
      throw Error('Invalid email');
    }
  }

  validateTag(tagString) {
    let pattern = /^\w{1,15}$/;
    if (!pattern.test(tagString)) {
      throw Error('Invalid tag. Must be 1-15 alphanumeric characters (underscores permitted)');
    }
  }

  validateContact(contact) {
    this.validateName(contact.full_name);
    this.validatePhone(contact.phone_number);
    this.validateEmail(contact.email);
  }

  #formatTags(contact) {
    if (contact.tags.length === 0) {
      contact.tags = [];
    } else {
      contact.tags = contact.tags.split(',');
    }
  }

  #addTagsToTagSet(contact) {
    if (contact.tags.length > 0) {
      contact.tags.forEach(tag => this.#tags.add(tag));
    }
  }

  get tags() {
    return this.#tags;
  }

  get list() {
    return this.#list;
  }
}

export {ContactList};