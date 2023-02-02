import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FlatList, Image, StyleSheet, Button, Text, TextInput, View, } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
export default function App() {
  const [songs, setMain] = useState([]);
  const [search, setSearch] = useState('');
  const [Aclick, setAclick] = useState('');
  function all() {
    console.log("clicked on download all button");
    setAclick('T')
    songs.forEach(element => {
      return new Promise((resolve, reject) => {
        RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DownloadDir + '/SavanD/' + element.name + '.m4a')
          .then((exist) => {
            // console.log('came3');
            // console.log(`file ${exist ? '' : 'not'} exists`)
            exist ? console.log('Already Exists') :

              RNFetchBlob
                .config({
                  addAndroidDownloads: {
                    title: element.name,
                    useDownloadManager: true,
                    notification: true,
                    description: 'File downloaded by download manager.',
                    path: RNFetchBlob.fs.dirs.DownloadDir + '/SavanD/' + element.name + '.m4a'
                  }
                })
                .fetch('GET', element.downloadUrl[element.downloadUrl.length - 1].link)
                .then((resp) => {
                  RNFetchBlob.android.actionViewIntent(resp.path(), '/')
                })
                .catch((error) => {
                  console.log(error);
                })

          })
          .catch((error) => { console.log(error); })

      }).catch((error) => {
        console.log(error);
      })
    });

  }
  function start() {
    if (search.includes("playlist")) {
      console.log('Playlist');
      var Pid = search.slice(search.lastIndexOf("/") + 1, search.length)
      axios.get('https://saavn.me/playlists?id=168710296')
        .then(res => {
          console.log(res.data.data.songs);
          setMain(res.data.data.songs)
        }).catch((error) => {
          console.log(error);
          alert('Incorrect URL')
          setErr('Not Found')
        })
      console.clear
    }
    else if (search.includes("song")) {
      console.log('Song');
      axios.get('https://apg-saavn-api.herokuapp.com/result/?q=' + search)
        .then(res => {
          setName(res.data.song)
          setUrl(res.data.media_url)
          setData(res.data);
        }).catch((error) => {
          alert('Incorrect URL')
          setErr('Not Found')
        })
      console.clear
    } else {
      console.log("Search is " + search);
      axios.get('https://saavn.me/search/songs?query=' + search + "&page=1&limit=20")
        .then(res => {
          // console.log(JSON.stringify(res.data.data.results));
          console.log(JSON.stringify(res.data.data.results.length));
          setMain(res.data.data.results)
        }).catch((error) => {
          console.log(JSON.stringify(res.data.results));
          alert('Incorrect Name')
          setErr('Not Found')
        })
    }
  }
  return (
    <View style={styles.container}>
      <Text>Savan</Text>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={{ flex: 1, }} >
          {Aclick == 'T' ? <View>
            <Text>
              Clicked on downloaded Buttton
            </Text>
          </View> : null}
          <TextInput
            placeholder="Song Name or Song Link or Playlist Link"
            style={styles.textInput}
            placeholderTextColor="#FFF"
            onChangeText={e => setSearch(e)}
          />
          <TouchableOpacity style={styles.button} onPress={start}>
            <Text>Press Here</Text>
          </TouchableOpacity>
          {songs.length == 0 ?

            null
            : (
              <View style={{ height: '90%' }}>

                <TouchableOpacity style={styles.b2}
                  onPress={() => all()}>
                  <Text>Download All</Text>
                </TouchableOpacity>
                <FlatList
                  data={songs}
                  keyExtractor={(item, id) => id.toString()}
                  renderItem={({ item, id }) => (
                    <View style={styles.songContainer}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Image
                          style={{ height: 40, width: 40, borderRadius: 10 }}
                          source={{ uri: item.image[0].link }}
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                          <Text
                            style={{ width: 150, color: '#FFF', fontSize: 14, marginHorizontal: 30 }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{ width: 150, color: '#FFF', fontSize: 14, marginHorizontal: 30 }}>
                            {item.album.name}
                          </Text>
                          <Text
                            style={{ width: 150, color: '#FFF', fontSize: 14, marginHorizontal: 30 }}>
                            {item.language}
                          </Text>

                        </View>

                        <View>
                          <TouchableOpacity style={styles.buttonF} onPress={() => {

                            return new Promise((resolve, reject) => {
                              RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DownloadDir + '/SavanD/' + item.name + '.m4a')
                                .then((exist) => {
                                  console.log(`file ${exist ? '' : 'not'} exists`)
                                  exist ? console.log('Already exits') :
                                    RNFetchBlob
                                      .config({
                                        addAndroidDownloads: {
                                          title: item.name,
                                          useDownloadManager: true,
                                          notification: true,
                                          description: 'File downloaded by download manager.',
                                          path: RNFetchBlob.fs.dirs.DownloadDir + '/SavanD/' + item.name + '.m4a'
                                        }
                                      })
                                      .fetch('GET', item.downloadUrl[item.downloadUrl.length - 1].link)
                                      .then((res) => {
                                        let status = res.info().status;

                                        if (status == 200) {
                                          let base64Str = res.base64()
                                          let text = res.text()
                                          let json = res.json()
                                        } else {
                                        }
                                      })
                                      // Something went wrong:
                                      .catch((errorMessage, statusCode) => {
                                        // error handling
                                      })

                                }).catch((error) => {
                                  console.log(error);
                                })
                            }).catch((error) => {
                              console.log(error);
                            })
                          }}>

                            <View style={{ backgroundColor: "dodgerblue", borderRadius: 14, marginTop: 10, justifyContent: 'center', aalignItems: 'center' }} >
                              <Text style={{ color: "#FFF", textAlign: 'center', padding: 5 }} >Down</Text>
                            </View>

                          </TouchableOpacity>
                        </View>
                      </View>

                    </View>
                  )}
                />
              </View>
            )}
         
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  start: {
    marginTop: 10
  },
  b2: {
    marginTop: 10,
    alignSelf: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  button: {
    color: 'white',
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  buttonF: {
    width: 70,
    marginTop: 5,
    alignSelf: 'center',
  },
  error: {
    marginTop: 20,
    color: '#fff',
    borderRadius: 30,
    backgroundColor: 'tomato',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 10,
  },
  songContainer: {
    padding: 7,
    backgroundColor: '#111',
    borderRadius: 7,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  textInput: {
    textAlign: 'center',
    height: 40,
    width: '100%',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: 14,
    marginTop: 40,
    borderRadius: 7,
    marginBottom: 20
  },
});

