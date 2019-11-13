// Libs
import React from "react";
import * as localForage from "localforage";

// Components
import Dashboard from "components/Dashboard";
import InfiniteScroll from "components/InfiniteScroll";

// Utils
import { fetchImages } from "utils/api";

// Styles
import styles from "./App.module.scss";
import dashboardStyles from "components/Dashboard/Dashboard.module.scss";

// Constants
const MAX_PIN_HEIGHT = parseInt(dashboardStyles.MAX_PIN_HEIGHT, 10);

const imageStore = localForage.createInstance({
  name: "imageStore"
});

export default class App extends React.Component {
  state = {
    currentPage: 1,
    pins: []
  };

  async componentDidMount() {
    const pins = [];

    // Attempt to load data from local storage
    console.time("Store Read Time");
    try {
      await imageStore.iterate(image => {
        pins.push(image);
      });
    } catch (error) {
      console.error(error);
    }
    console.timeEnd("Store Read Time");

    if (pins.length > 0) {
      this.setPins(pins);
    } else {
      const response = await this.loadCurrentPage();
      this.setPins(response.data);
    }
  }

  render() {
    return (
      <div className={styles.app}>
        <InfiniteScroll onLoad={this.loadNextPage} threshold={MAX_PIN_HEIGHT}>
          <Dashboard pins={this.state.pins} />
        </InfiniteScroll>
      </div>
    );
  }

  // -------
  // HELPERS
  // -------

  loadCurrentPage = async () => {
    let response = new Response();

    try {
      // Fetch images for the current page
      response = await fetchImages({ page: this.state.currentPage });

      // Save response in local storage
      for (const item of response.data) {
        await imageStore.setItem(item.id, item);
      }
    } catch (error) {
      // TODO: Log response error and notify user
      console.error(error);
    }

    return response;
  };

  loadNextPage = async () => {
    this.setState(
      prevState => ({
        currentPage: prevState.currentPage + 1
      }),
      async () => {
        console.log("loading page", this.state.currentPage);

        const response = await this.loadCurrentPage();

        if (response.data) {
          this.setPins(this.state.pins.concat(response.data));
        }
      }
    );
  };

  setPins = pins => {
    this.setState({
      pins
    });
  };
}
