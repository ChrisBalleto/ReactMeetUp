import React from 'react';
import { ListView, Image, StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class MyComponent extends React.Component {
    render(){
        return(
            <View>
            <Text>
                PBR me ASAP!
            </Text>
                <Image source={{uri:"http://pngimg.com/uploads/beer/beer_PNG2388.png"}} style={{height: 200, width: 200}} />
            </View>
        );
    }
}

const checkStatus = (response) => {
    if (!response.ok) { // status in the range 200-299 or not
        return Promise.reject(new Error(response.statusText || 'Status not OK'))
    }
    return response
}

const parseJSON = (response) => response.json()

const makeFetch = (url, options) => fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)

class Loader extends React.Component {
    render(){
        return (<Text>Loading...</Text>);
    }
}




class ArticlesScreen extends React.Component {
    static navigationOptions = {
        title: 'Articles',
    };

    constructor(props) {
        super(props)
        this.state = {
            hasFetched: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
    }
    componentDidMount(){
        makeFetch('https://jsonplaceholder.typicode.com/posts').then((data) => {
            this.setState(()=> {
                return {
                    hasFetched: true,
                    dataSource: this.state.dataSource.cloneWithRows(data)
                };
            })
        })
    }
    render() {
        const { hasFetched, dataSource } = this.state;
        return (
            <View>
                {hasFetched ?
                    <ListView
                        dataSource={dataSource}
                        renderRow={(rowData) => <Text>{rowData.title}</Text>}
                    />
                    : <Loader />
                }
            </View>
        );
    }
}

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <ArticlesScreen/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
