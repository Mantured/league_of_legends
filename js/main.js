new Vue({
  el: "#app",
  data: {
    champions: [],
    selectedRole: "",
    selectedDifficulty: "",
    searchQuery: "",
    roles: [],
    difficulties: ["1", "2", "3", "4", "5"],
    randomChampion: null,
    showRandomChampionOnly: false,
  },
  computed: {
    filteredChampions() {
      // Filtra i campioni in base al ruolo, alla difficoltà e alla ricerca
      return this.champions.filter((champion) => {
        const roleMatch =
          !this.selectedRole || champion.tags.includes(this.selectedRole);
        const difficultyMatch =
          !this.selectedDifficulty ||
          champion.info.difficulty.toString() === this.selectedDifficulty;
        const searchMatch =
          !this.searchQuery ||
          champion.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return roleMatch && difficultyMatch && searchMatch;
      });
    },
  },
  methods: {
    getImageUrl(championName) {
      // Clean the champion name before constructing the URL
      return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`;
    },
    getChampionUrl(championId) {
      return `https://na.leagueoflegends.com/en-us/champions/${championId}/`;
    },
    fetchChampionsData() {
      axios
        .get(
          `https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json`
        )
        .then((response) => {
          const championsData = response.data.data;
          for (const championKey in championsData) {
            const champion = championsData[championKey];
            this.champions.push({
              id: champion.id,
              name: champion.name,
              tags: champion.tags,
              info: champion.info,
              image: champion.image,
            });

            // Aggiungi ruoli all'array roles (senza duplicati)
            champion.tags.forEach((role) => {
              if (!this.roles.includes(role)) {
                this.roles.push(role);
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    showRandomChampion() {
      // Mostra un campione casuale
      const randomIndex = Math.floor(Math.random() * this.champions.length);
      this.randomChampion = this.champions[randomIndex];
      this.showRandomChampionOnly = true;
    },
  },
  mounted() {
    this.fetchChampionsData();
  },
});
