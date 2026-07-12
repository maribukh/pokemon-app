import { Component } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';

class HomePage extends Component {
  render() {
    return (
      <>
        <Header />
        <Search onSearch={} />
      </>
    );
  }
}

export default HomePage;
