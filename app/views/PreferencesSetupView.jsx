import React, { useEffect, useState } from "react";
import {
	Dimensions,
	SafeAreaView,
	View,
	TouchableOpacity,
	StyleSheet,
	Alert,
	Text
} from "react-native";
import {
    FAB
} from "react-native-elements";
import { AutoDragSortableView } from "react-native-drag-sort";
import { BACKEND_ADDRESS } from "@env";
import { useNavigation } from "@react-navigation/native";
import supabase from "../../config/supabase";
import axios from "axios";

const {width} = Dimensions.get('window');
const parentWidth = width;
const childrenWidth=width - 20;
const childrenHeight=48;

export default function PreferencesSetupView(){
	const [data, setData] = useState([]);
	const [user, setUser] = useState(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
            } else {
                Alert.alert("Error Accessing User Data");
            }
        });
		setData([["weather",1, "Fits the weather"], ["availability",2, "More available slots"], ["hourly_cost",3, "Lower hourly rates"]]);
		
	}, []);



	const navigation = useNavigation();
    async function addPreference() {
    	axios
            .post(
                `${BACKEND_ADDRESS}/addPreference?id=${user.identities[0].id}&preference=${JSON.stringify(Object.fromEntries(data))}`
            )
            .then((res) => {
            	console.log("Success");
            	// * To add back 
            	//navigation.navigate("Home");
            })
            .catch((error) => {
                console.log(error);
                //can add alert or banner here
            });
    };



    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.header_title}>Which parking locations would your prefer?</Text>
            </View>

            <AutoDragSortableView
                dataSource={data}
                
                parentWidth={parentWidth}
                childrenWidth= {childrenWidth}
                marginChildrenBottom={10}
                marginChildrenRight={10}
                marginChildrenLeft = {10}
                marginChildrenTop={10}
                childrenHeight={childrenHeight}
                onClickItem={(data,item,index) => {
                	if (data[index][1]==-1){
                		data[index][1]=0;
                	} else {
                		data[index][1]=-1;
                	}
               		//reindex
               		let i=1;
           		    data.map((ditem, dindex) => {
        				if (ditem[1]!=-1){
        					ditem[1] = i;
        					i++;
        					return ditem;
        				} else {
        					return ditem;
        				}
        			});

                	setData(data);
                	
                }}
                onDataChange = {(data)=>{
                    if (data.length != 0) {
                    	//reindex data 
                    	let i = 1;
            			data.map((item, index) => {
            				if (item[1]!=-1){
            					item[1] = i;
            					i++;
            					return item;
            				} else {
            					return item;
            				}
            			})
                        setData(data);
                    }
                }}
                renderItem={(item,index)=>{
                    return LItem(item,index)
                }}
            />
          	<FAB
          		onPress={()=>{addPreference()}}
          		title="Done"
          		color="green" 
          		placement="right"
          	/>
        </SafeAreaView>
    );
    


}

function LItem(item,index) {
    return (
        <View style={item[1] == -1 ? styles.item_disabled : styles.item} key={index}>
        	<Text style={styles.item_text}>{item[2]}</Text>
            <View style={styles.item_icon_swipe}>
            <Text>{item[1]}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header_title: {
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold',
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2ecc71',
        borderRadius: 4,
    },
    item_icon_swipe: {
        width: childrenHeight-10,
        height: childrenHeight-10,
        backgroundColor: '#fff',
        borderRadius: (childrenHeight - 10) / 2,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_text: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 20,
        fontWeight: 'bold',
    },    
    item_disabled: {
        width: childrenWidth,
        height: childrenHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
        borderRadius: 4,
    },

})