import { StyleSheet, Platform } from 'react-native'

const styles = StyleSheet.create({
  scroller: {
    alignItems: "center",
    justifyContent: 'center',
    padding: 20,
  },

  btnStyls: {
    borderRadius: 25,
  },
  btnTextStyle: {
    color: '#ccc'
  },

  giftScroller: {
    alignItems: "center",
    flexDirection:'row',
  },

  stepperStyle: {
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  stepperOperatorStyle: {
    width:  20,
    height: 20,
    borderWidth: 2,
    borderColor: "#fff",
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  stepperInputStyle: {
    width: 28,
    height: 25,
    fontSize: 15,
    fontWeight: "400",
    color: "#fff",
    backgroundColor: "#9999cc",
    borderRadius: 5,
    marginHorizontal: 3,
    marginVertical: 5,
  },

  prgText: {
    fontSize: 34,
    color: 'orange',
    marginBottom: 4,
    marginLeft: 10
  },
  prgStyle: {
    height: 40,
    width: 400,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255,255, 0.6)',
  },
  barStyle: {
    height: 40,
    opacity: 1
  }

});

export default styles;