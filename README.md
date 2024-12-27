# Contact Manager
## Overview
contact manager is a web application that allows users to manage contacts like a contact book. Users are able to add, edit and delete contacts. Users are also able to add tags apply tags to certain contacts. Users can search for contacts by their name or tag.

## Files
- `ContactList.js` creates a `ContactList` object that handles storage of contacts and tags. also handles validation of input
- `RequestManager.js` creates a `RequestManager` object that handles serializing data, sending requests to the server and parsing the responses
- `UserInterface.js` creates a `UserInterface` object that handles DOM manipulation and binds events to `Application` methods
- `app.js` creates an `Application` object that handles the program logic.

## Features
- Add contact -> Click the “Add Contact” button and submit the subsequent form to create a new contact.
- Edit contact -> Click the “Edit” button under a given contact’s options and submit the subsequent form to update that contact
- Delete contact -> Click the “Delete” button under a given contact’s options to delete a contact. Confirmation is required.
- Search contacts -> Click on the search bar and type a query to search contact for a match. The search results live update as the user searches. users can select to search by name or tag. Tap the ‘Escape’ key to clear the search 
- Auto-search -> Click on a tag from the contacts screen to perform an auto-search based on that tag. Clear the search panel to reset the search
- Add tags -> Click on the “Add tag” button to open the tag form. From there, add tags by filling in the input and clicking the “Save” button
- Delete tags -> from the tag menu click on a tag to remove it. This will update all contacts with this tag. Requires confirmation
## Input validations
- Full name: Accepts 1-50 characters, at least one must not be whitespace
- Phone number: Accepts 10 numerical characters
- email: Accepts input that follows a simple email pattern (eg: daniel@example.com)
- tags: Accepts 1-15 alphanumeric characters and underscores