import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listMessages } from './graphql/queries';
import { createMessage as createMessageMutation, deleteMessage as deleteMessageMutation } from './graphql/mutations';
import { Widget } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

const initialFormState = { name: '', description: '' }

function App() {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [username, setUserName] = '';
  

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const apiData = await API.graphql({ query: listMessages });
    const authdata = await Auth.currentUserInfo();
    setUserName(authdata.data);

    setMessages(apiData.data.listMessages.items);
  }

  async function createMessage() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createMessageMutation, variables: { input: formData } });
    setMessages([ ...messages, formData ]);
    setFormData(initialFormState);
  }

  async function deleteMessage({ id }) {
    const newMessageArray = messages.filter(note => note.id !== id);
    setMessages(newMessageArray);
    await API.graphql({ query: deleteMessageMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <div className="App">
      <Widget />
    </div>
    </div>
  );
}

export default withAuthenticator(App);
