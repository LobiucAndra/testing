  
  <script>
  import axiosInstance from '@/axios';
import RefuzeExam from '@/components/RefuzeExam.vue';
  
  export default {
    name: 'FillRequest',
    props: {
      date: {
          type: String, // Sau Date, în funcție de formatul pe care îl folosești
          required: false,
        },
       id:{
        type: String,
        required: false,
       } 
    },
    components: {
      RefuzeExam,
    },
    watch: {
    selectedClass(newValue) {
      this.onSalaChange(newValue);
    },
  },
    emits: ['update:modelValue', 'submit'],
    data() {
      return {
        dialogVisible: false, // Manage dialog visibility
        selectedClass: null,
        selectedAsistent: null,
        selectStartDate: null,
        selectEndDate: null,
        assistents: [],
        sali: [],
        loading: false,
        validationError: '',
        dataFetched: false, // Track if data has been fetched to prevent redundant calls
        additionalData: [],
        generatedIntervals: [],
        dropdownItems: [], // Data for v-autocomplete dropdown
        items: [], // Data for v-autocomplete dropdown
      };
    },
    methods: {
      async fetchAssistenti() {
        this.loading = true;
        try {            
          this.assistents= [];   
          const id =localStorage.getItem('id');

          const data = {
            "profesorid": id,
            "data": this.date,
            "orastart": this.selectStartDate,
            "orafinal": this.selectEndDate
          }
          console.log(data);
          const request =await axiosInstance.post('/examen/asistentdisponibil',data);         
     
          for( var i = 0; i < request.data.length; i++ )
            {
              this.assistents.push(request.data[i]);
            }
          this.dataFetched = true; // Mark data as fetched

        } catch (error) {
         console.error('Error fetching data:', error);
          this.items = [];
        } finally {
          this.loading = false;

        }
      },
      generateHourlyIntervalsForStart(start,endTime) {

        const result = [];
        let currentTime = start;
        while (currentTime <= endTime) {
          const nextTime = this.addMinutesToTime(currentTime, 60); // Următoarea oră
          result.push(`${currentTime}`); // Adăugăm intervalul
          currentTime = nextTime; // Trecem la următoarea oră
        }

        this.additionalData = result;
    
      },

      generateHourlyIntervals(start) {
        const interval = [];
        var poz = this.additionalData.findIndex(item => item === start);
       

        for(var i = poz + 1; i < this.additionalData.length; i++){
          interval.push(this.additionalData[i]);
        }
        if (!interval) return;
      
        this.generatedIntervals = interval;
    
      },

     addMinutesToTime(timeString, minutesToAdd) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + minutesToAdd;
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
      },

      async onSalaChange(selectedSalaId) {  
      if (!selectedSalaId) {
        this.additionalData = [];
        return;
      }
      this.additionalData = [];
      this.selectStartDate = null;
      this.selectEndDate = null;
      this.generatedIntervals = [];

      this.loading = true;
      try {
        const response = await axiosInstance.get(`/sali/${selectedSalaId}/${this.date}`);
        for( var i = 0; i < response.data.length; i++ )
            {
              this.additionalData.push(this.generateHourlyIntervalsForStart(response.data[i].ora_start,response.data[i].ora_end));
            }
      
        console.log('Data for selected sala:', response.data);
      } catch (error) {
        console.error('Error fetching sala details:', error);
        this.additionalData = [];
      } finally {
        this.loading = false;
      }
    },
  
    async fetchSali(newSelectedValue) {
      this.dropdownItems = [];
      if (!newSelectedValue) {
        return;
      }
      try {
        const request = await axiosInstance.get(`/sali/dupanume/${newSelectedValue}`);
        this.dropdownItems = request.data; // Update the items with the fetched data
       
      } catch (error) {
        console.error("Error fetching data:", error);
        this.dropdownItems = []; // Clear items if there's an error
      }
    },

      async submitForm() {
        this.validationError = '';
  
        if (!this.selectedAsistent) {
          this.validationError = 'Please select a assistent.';
          return;
        }
        if (!this.selectedClass) {
          this.validationError = 'Please select a class.';
          return;
        }
        if (!this.selectStartDate) {
          this.validationError = 'Please select a start hour.';
          return;
        }
        if (!this.selectEndDate) {
          this.validationError = 'Please select a end hour.';
          return;
        }
  
        this.loading = true;
        const idUtilizator = localStorage.getItem('id');
        const formData = {
            id: this.id,
            asistentid: this.selectedAsistent,
            orastart: this.selectStartDate,
            orafinal: this.selectEndDate,
            actualizatde: idUtilizator,
            salaid: this.selectedClass
          }

        try {
          const response = await axiosInstance.put('/profesor/acceptaexamen', formData);
          console.log(response.status);
          if (response.status === 200 || response.status === 201) {
            this.$emit('submit', formData);
            this.$router.push({ name: 'ViewRequests' });
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          this.validationError = 'Failed to submit the form. Please try again.';
        } finally {
          this.loading = false;
        }
      },
  
      closeDialog() {
        this.resetForm();
        this.$router.push({ name: 'ViewRequests' });
      },
    
  
      resetForm() {
        this.selectedDate = null;
        this.selectedClass = null;
        this.validationError = '';
        this.dataFetched = false; // Reset dataFetched so data can be fetched again next time
      },
    },
  };
  </script>
  
  <style scoped>
  /* Optionally, you can add styles here */
  </style>
  


  <template>
    <v-row
      justify="center"
      align="center"
      class="full-height"
    >
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4" persistent>
          <v-card-title>
            <span class="headline">Teacher Form</span>
          </v-card-title>
  
          <v-card-text>
            <!-- Loading Spinner -->
            <v-row v-if="loading" justify="center">
              <v-col cols="auto">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                  width="4"
                ></v-progress-circular>
              </v-col>
            </v-row>
            
            <v-autocomplete
            v-model="selectedClass"
            clearable
            label="Select Sala"
            :items="dropdownItems"
            item-title="nume"
            item-value="id"
            @update:search="fetchSali"
            class="min-width-200"
          ></v-autocomplete>
            <!-- Start Date Select -->
            <v-select
              v-if="!(additionalData.length === 0)"
              v-model="selectStartDate"
              label="Select Start Hour"
              :items="additionalData"
              clearable
              @update:modelValue="generateHourlyIntervals(selectStartDate)"
            ></v-select>
  
            <!-- End Date Select -->
            <v-select
              v-if="selectStartDate"
              v-model="selectEndDate"
              label="Select Erd Hour"
              :items="generatedIntervals"
              item-title="ora_end"
              clearable
              @update:modelValue="fetchAssistenti()"

            ></v-select>
            <!-- Asistent pick -->
            <v-select
              v-model="selectedAsistent"
              label="Select Assistent"
              :items="assistents"
              item-title="nume"
              item-value="id"
              clearable
              v-if="selectStartDate !=null && selectEndDate !=null"
            ></v-select>
  
            <!-- Error Message -->
            <v-alert v-if="validationError" type="error" class="mt-3">
              {{ validationError }}
            </v-alert>
          </v-card-text>
  
          <v-card-actions>
            <v-row justify="end">
              <v-btn color="error" text @click="dialogVisible = true" :disabled="loading">Reject</v-btn>
              <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
              <v-btn color="primary" @click="submitForm" :loading="loading" :disabled="loading">Submit</v-btn>
            </v-row>
          </v-card-actions>
          <RefuzeExam v-model="dialogVisible" :id="this.id"  :is-teacher="true"
          />
        </v-card>
      </v-col>
    </v-row>
  </template>
  
