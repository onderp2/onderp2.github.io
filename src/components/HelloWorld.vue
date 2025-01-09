<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card class="mx-auto mt-4" max-width="600">
          <v-card-title>Telegram Mini App Demo</v-card-title>

          <v-card-text>
            <div v-if="isValidated">
              <v-list>
                <v-list-item>
                  <v-list-item-title>User ID</v-list-item-title>
                  <v-list-item-subtitle>{{ userData.id || 'Not available' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Username</v-list-item-title>
                  <v-list-item-subtitle>{{ userData.username || 'Not available' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>First Name</v-list-item-title>
                  <v-list-item-subtitle>{{ userData.first_name || 'Not available' }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
            <v-alert
                v-else
                type="warning"
                text="Data validation failed. Please ensure you're accessing this app through Telegram."
            ></v-alert>

            <v-divider class="my-4"></v-divider>

            <v-list>
              <v-list-item>
                <v-list-item-title>Platform</v-list-item-title>
                <v-list-item-subtitle>{{ platformInfo.platform || 'Not available' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Color Scheme</v-list-item-title>
                <v-list-item-subtitle>{{ platformInfo.colorScheme || 'Not available' }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-btn
                color="primary"
                block
                @click="showAlert"
                :disabled="!isValidated"
            >
              Show Telegram Alert
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mx-auto mt-4" max-width="600">
          <v-card-title>Interactive Features</v-card-title>

          <v-card-text>
            <v-text-field
                v-model="message"
                label="Enter message"
                outlined
                :disabled="!isValidated"
            ></v-text-field>

            <v-btn
                color="success"
                block
                class="mt-4"
                @click="sendData"
                :disabled="!isValidated"
            >
              Send to Main Button
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'HelloWorld',

  data() {
    return {
      userData: {},
      platformInfo: {},
      message: '',
      tg: null,
      isValidated: false
    }
  },

  created() {
    // Initialize Telegram WebApp
    this.tg = window.Telegram.WebApp

    // Validate the data
    try {
      // Get and parse initData
      const initData = this.tg.initData
      if (!initData) {
        throw new Error('No init data available')
      }

      // Here you would typically send initData to your backend
      // to validate it using Telegram's API
      // For demo purposes, we'll just check if it exists
      this.isValidated = true

      // Parse the validated data
      const searchParams = new URLSearchParams(initData)
      const user = searchParams.get('user')
      if (user) {
        this.userData = JSON.parse(user)
      }
    } catch (error) {
      console.error('Data validation failed:', error)
      this.isValidated = false
    }

    // Enable closing confirmation
    this?.tg.enableClosingConfirmation()

    // Ready event
    this?.tg.ready()

    // Get platform info
    this.platformInfo = {
      platform: this.tg.platform,
      colorScheme: this.tg.colorScheme,
      version: this.tg.version
    }


    const mainButton = this.tg.mainButton;

    mainButton?.setText("Send message");
    mainButton?.onClick(() => {
      this.tg.showAlert(`Message sent: ${this.message}`)
    })
  },

  methods: {
    showAlert() {
      this.tg.showAlert('This is a Telegram Mini App alert!')
    },

    sendData() {
      if (this.message) {
        this.tg.MainButton.show()
      } else {
        this.tg.showAlert('Please enter a message first')
      }
    }

  }
}

</script>
