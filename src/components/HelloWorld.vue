<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span>Start from here</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer>
              <v-btn variant="flat" color="black"><span>Start here</span>
                <template v-slot:append>
                  <v-icon color="success" size="20">mdi-check</v-icon>
                </template>
              </v-btn>
            </v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import logo from '../assets/logo.svg'

export default {
  name: 'HelloWorld',
}

</script>
