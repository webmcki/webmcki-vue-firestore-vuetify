<template>
  <div>
    <v-toolbar
      flat
      color="green"
    >
      <v-toolbar-title>My CRUD2</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <v-btn
          slot="activator"
          color="primary"
          dark
          class="mb-2"
        >New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedItem.name"
                    label="Dessert name"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedItem.calories"
                    label="Calories"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedItem.fat"
                    label="Fat (g)"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedItem.carbs"
                    label="Carbs (g)"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedItem.protein"
                    label="Protein (g)"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              flat
              @click="close"
            >Cancel</v-btn>
            <v-btn
              color="blue darken-1"
              flat
              @click="save"
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
    >
      <!-- item-key="desserts.key" -->
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.calories }}</td>
        <td class="text-xs-left">{{ props.item.fat }}</td>
        <td class="text-xs-left">{{ props.item.carbs }}</td>
        <td class="text-xs-leftt">{{ props.item.protein }}</td>
        <td class="justify-left layout px-0">
          <i
            class="fas fa-edit"
            @click="editItem(props.item, props.item.key)"
          ></i>
          <i
            class="fas fa-trash-alt"
            @click="deleteItem(props.item.key)"
          ></i>
        </td>
      </template>
      <template slot="no-data">
        <v-btn
          color="primary"
          @click="initialize"
        >Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import firebase from '../../Firebase'
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Dessert (100g serving)',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    desserts: [],
    ref: firebase.firestore().collection('dessert'),
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.ref.onSnapshot((querySnapshot) => {
        this.desserts = []
        querySnapshot.forEach((doc) => {
          this.desserts.push({
            key: doc.id,
            name: doc.data().name,
            calories: doc.data().calories,
            fat: doc.data().fat,
            carbs: doc.data().carbs,
            protein: doc.data().protein
          })
        })
      })
    },

    editItem (item, itemkey) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.itemkey = itemkey
      this.dialog = true
    },

    deleteItem (item) {
      confirm('Are you sure?') &&
        this.ref.doc(item).delete().then(function () {
          console.log('delete OK')
        }).catch(function (error) {
          console.error('delete failure: ', error)
        }
        )    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        console.log('inner index: ' + this.editedIndex + '<------->' + this.itemkey)
        this.ref.doc(this.itemkey).set(this.editedItem)
          .then(function () {
            console.log("Document successfully written!")
          })
          .catch(function (error) {
            console.error("Error writing document: ", error)
          })
      } else {
        this.ref.add(this.editedItem)
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      }
      this.close()
    }
  }
}
</script>

<style scoped>
i {
  margin-left: 5px;
  font-size: 25px;
  height: 5px;
  vertical-align: -webkit-baseline-middle;
}
</style>