class RequestManager {
  async getContacts() {
    let response = await fetch('http://localhost:3000/api/contacts', {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });

    if (response.status >= 400 && response.status <= 499) {
      throw new Error(response.statusText);
    }

    response = await response.json();
    return response;
  }

  async createContact(data) {
    let response  = await fetch('http://localhost:3000/api/contacts/', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    });

    if (response.status >= 400 && response.status <= 499) {
      throw new Error(response.statusText);
    }

    response = await response.json();
    return response;
  }

  async deleteContact(id) {
    let response = await fetch(`http://localhost:3000/api/contacts/${id}`, {
      method: "DELETE",
    });

    if (response.status !== 204) {
      throw new Error(response.statusText);
    }

    return response;
  }

  async fetchContact(id) {
    let response = await fetch(`http://localhost:3000/api/contacts/${id}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    response = await response.json();
    return response;
  }

  async editContact(id, data) {
    let response = await fetch(`http://localhost:3000/api/contacts/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    });

    if (response.status !== 201) {
      throw Error('did not update');
    }

    response = await response.json();
    return response;
  }
}

export { RequestManager };