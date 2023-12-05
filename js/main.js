new Vue({
  el: "#app",
  data: {
    champions: [],
    selectedRole: "",
    selectedDifficulty: "",
    searchQuery: "",
    roles: [],
    difficulties: [],
    randomChampion: null,
    showRandomChamp: false,
  },
  computed: {
    filteredChampions() {
      // Filtra i campioni in base al ruolo, alla difficoltà e alla ricerca
      return this.champions.filter((champion) => {
        const roleMatch =
          !this.selectedRole || champion.tags.includes(this.selectedRole);
        const difficultyMatch =
          !this.selectedDifficulty ||
          champion.info.difficulty === parseInt(this.selectedDifficulty, 10);
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
          `https://ddragon.leagueoflegends.com/cdn/13.23.1/data/it_IT/champion.json`
        )
        .then((response) => {
          const championsData = response.data.data;
          for (const championKey in championsData) {
            const champion = championsData[championKey];
            this.champions.push({
              version: champion.version,
              id: champion.id,
              key: champion.key,
              name: champion.name,
              title: champion.title,
              blurb: champion.blurb,
              tags: champion.tags,
              info: champion.info,
              image: champion.image,
              partype: champion.partype,
              stats: champion.stats,
            });

            // Aggiungi ruoli all'array roles (senza duplicati)
            champion.tags.forEach((role) => {
              if (!this.roles.includes(role)) {
                this.roles.push(role);
              }
            });
            for (const difficulty in champion.info) {
              if (!this.difficulties.includes(champion.info[difficulty])) {
                this.difficulties.push(champion.info[difficulty]);
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    showRandomChampion() {
      // Filtra i campioni in base al ruolo e alla difficoltà selezionati
      const filteredChampions = this.champions.filter((champion) => {
        const roleMatch =
          !this.selectedRole || champion.tags.includes(this.selectedRole);
        const difficultyMatch =
          !this.selectedDifficulty ||
          champion.info.difficulty === parseInt(this.selectedDifficulty, 10);
        return roleMatch && difficultyMatch;
      });

      // Se ci sono campioni che soddisfano i criteri, seleziona un campione casuale
      if (filteredChampions.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * filteredChampions.length
        );
        this.randomChampion = filteredChampions[randomIndex];
        this.showRandomChamp = true;
      } else {
        // Altrimenti, se non ci sono campioni che soddisfano i criteri, resetta il campione casuale
        this.randomChampion = null;
        this.showRandomChamp = false;
      }
    },
  },
  mounted() {
    this.fetchChampionsData();
  },
});
