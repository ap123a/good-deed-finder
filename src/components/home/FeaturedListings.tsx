import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ListingCard, { Listing } from "@/components/listings/ListingCard";
import { motion } from "framer-motion";

const featuredListings: Listing[] = [
  {
    id: "1",
    title: "Palīdzība dzīvnieku patversmē",
    organization: "Dzīvnieku draugi",
    location: "Rīga",
    category: "Dzīvnieki",
    description: "Meklējam brīvprātīgos, kas palīdzētu rūpēties par kaķiem un suņiem patversmē. Darbs ietver barošanu, pastaigas un spēlēšanos.",
    timeCommitment: "4-8h nedēļā",
    spots: 5,
    isNew: true,
  },
  {
    id: "2",
    title: "Bērnu nometnes vadītājs",
    organization: "Latvijas Skautu un Gaidu organizācija",
    location: "Jūrmala",
    category: "Izglītība",
    description: "Vasaras nometnes organizēšana un vadīšana bērniem vecumā no 8-14 gadiem. Nepieciešama pieredze darbā ar bērniem.",
    timeCommitment: "Pilna laika (2 nedēļas)",
    spots: 10,
    isUrgent: true,
  },
  {
    id: "3",
    title: "Vides sakopšanas talka",
    organization: "Zaļā Latvija",
    location: "Liepāja",
    category: "Vide",
    description: "Piedalies pludmales sakopšanas talkā! Nodrošinām inventāru un ēdināšanu. Aicinām visus dabas draugus.",
    timeCommitment: "1 diena",
    spots: 50,
    isNew: true,
  },
  {
    id: "4",
    title: "Senioru apmeklēšana veco ļaužu namā",
    organization: "Sarkanais Krusts",
    location: "Daugavpils",
    category: "Sociālais darbs",
    description: "Pavadi laiku ar senioriem, izlasi grāmatu, parunājies vai vienkārši uzklausi. Tava klātbūtne var kādam padarīt dienu gaišāku.",
    timeCommitment: "2-4h nedēļā",
    spots: 8,
  },
  {
    id: "5",
    title: "IT konsultants nevalstiskām organizācijām",
    organization: "Tech4Good",
    location: "Tiešsaiste",
    category: "IT",
    description: "Palīdzi NVO ar mājas lapu izveidi, sociālo tīklu pārvaldību un digitālo risinājumu ieviešanu.",
    timeCommitment: "Elastīgs grafiks",
    spots: 15,
    isOnline: true,
  },
  {
    id: "6",
    title: "Pasākumu organizatora palīgs",
    organization: "Latvijas Kultūras fonds",
    location: "Rīga",
    category: "Kultūra",
    description: "Palīdzība kultūras pasākumu organizēšanā - apmeklētāju sagaidīšana, informācijas sniegšana, vispārēja koordinācija.",
    timeCommitment: "Pasākumu laikā",
    spots: 20,
  },
];

const FeaturedListings = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Populārākie sludinājumi
            </h2>
            <p className="text-muted-foreground text-lg">
              Iepazīsties ar jaunākajām brīvprātīgā darba iespējām
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link to="/listings">
              Skatīt visus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
