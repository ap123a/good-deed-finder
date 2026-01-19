import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Clock,
  Users,
  Building2,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  Star,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app would come from API
const listingData = {
  id: "1",
  title: "Palīdzība dzīvnieku patversmē",
  organization: "Dzīvnieku draugi",
  location: "Rīga, Mārupes novads",
  category: "Dzīvnieki",
  description: `Meklējam brīvprātīgos, kas palīdzētu rūpēties par kaķiem un suņiem mūsu patversmē. 

Darba pienākumi:
• Dzīvnieku barošana un ūdens maiņa
• Pastaigas ar suņiem
• Spēlēšanās un socializēšana ar dzīvniekiem
• Palīdzība telpu uzkopšanā
• Dzīvnieku transportēšana pie veterinārārsta (ja ir auto)

Mūsu patversmē pašlaik ir aptuveni 50 suņi un 30 kaķi, kuriem nepieciešama uzmanība un rūpes. Katrs brīvprātīgais var atrast sev piemērotu lomu atkarībā no laika un spējām.`,
  requirements: [
    "Mīlestība pret dzīvniekiem",
    "Vecums vismaz 16 gadi (nepilngadīgajiem - vecāku piekrišana)",
    "Spēja strādāt fiziska rakstura darbus",
    "Punktualitāte un atbildība",
    "Gatavība strādāt brīvā dabā jebkuros laika apstākļos",
  ],
  benefits: [
    "Rekomendācijas vēstule",
    "Bezmaksas apmācības darbam ar dzīvniekiem",
    "Sertifikāts par brīvprātīgo darbu",
    "Iespēja adoptēt dzīvnieku ar atlaidi",
  ],
  timeCommitment: "4-8h nedēļā",
  schedule: "Elastīgs grafiks, iespējams strādāt arī nedēļas nogalēs",
  spots: 5,
  startDate: "Tūlītēja uzsākšana",
  isUrgent: false,
  isNew: true,
  rating: 4.8,
  reviewCount: 24,
  contact: {
    name: "Māra Liepiņa",
    email: "mara@dzivniekudraugi.lv",
    phone: "+371 2000 1234",
  },
};

const reviews = [
  {
    id: "1",
    author: "Līva K.",
    rating: 5,
    date: "2024-01-15",
    content: "Lieliska pieredze! Personāls ir ļoti atsaucīgs un dzīvnieki ir brīnišķīgi. Noteikti turpināšu šeit strādāt.",
  },
  {
    id: "2",
    author: "Artūrs B.",
    rating: 5,
    date: "2024-01-10",
    content: "Patversme ir labi organizēta, brīvprātīgajiem tiek sniegts viss nepieciešamais atbalsts. Ieteiktu visiem dzīvnieku mīļiem.",
  },
  {
    id: "3",
    author: "Kristīne M.",
    rating: 4,
    date: "2024-01-05",
    content: "Jauks kolektīvs un patīkama atmosfēra. Vienīgais mīnuss - dažreiz ir grūti nokļūt ar sabiedrisko transportu.",
  },
];

const ListingDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    motivation: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    toast({
      title: "Pieteikums nosūtīts!",
      description: "Organizācija ar tevi sazināsies tuvākajā laikā.",
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/50 py-4">
        <div className="container">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Atpakaļ uz sludinājumiem
          </Link>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{listingData.category}</Badge>
                  {listingData.isNew && <Badge variant="new">Jauns</Badge>}
                  {listingData.isUrgent && <Badge variant="urgent">Steidzami</Badge>}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {listingData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 shrink-0" />
                    <span className="font-medium text-foreground">{listingData.organization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>{listingData.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 text-warning fill-warning" />
                    <span className="font-medium text-foreground">{listingData.rating}</span>
                    <span className="text-muted-foreground">({listingData.reviewCount} atsauksmes)</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                    Saglabāt
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                    Dalīties
                  </Button>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Par darbu</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                  {listingData.description}
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Prasības</h2>
                <ul className="space-y-3">
                  {listingData.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Ko tu iegūsi</h2>
                <ul className="space-y-3">
                  {listingData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Atsauksmes</h2>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-warning fill-warning" />
                    <span className="font-semibold text-foreground">{listingData.rating}</span>
                    <span className="text-muted-foreground">({listingData.reviewCount})</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{review.author}</div>
                            <div className="text-sm text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-warning fill-warning" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{review.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Laika ieguldījums</div>
                        <div className="font-medium text-foreground">{listingData.timeCommitment}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Brīvās vietas</div>
                        <div className="font-medium text-foreground">{listingData.spots} vietas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sākums</div>
                        <div className="font-medium text-foreground">{listingData.startDate}</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full mt-6"
                    onClick={() => setIsApplying(!isApplying)}
                  >
                    Pieteikties
                  </Button>
                </motion.div>

                {/* Application Form */}
                {isApplying && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    {!isSubmitted ? (
                      <>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Pieteikuma forma</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Vārds, Uzvārds *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              placeholder="Tavs vārds"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-pasts *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              placeholder="tavs@epasts.lv"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefons</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+371 2000 0000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="motivation">Motivācijas vēstule *</Label>
                            <Textarea
                              id="motivation"
                              name="motivation"
                              value={formData.motivation}
                              onChange={handleInputChange}
                              required
                              rows={4}
                              placeholder="Pastāsti, kāpēc vēlies piedalīties..."
                            />
                          </div>
                          <Button type="submit" variant="default" className="w-full">
                            Nosūtīt pieteikumu
                          </Button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-success" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Paldies par pieteikumu!
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Organizācija ar tevi sazināsies tuvākajā laikā.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Organization Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-secondary/50 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">Kontaktpersona</h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-foreground">{listingData.contact.name}</p>
                    <p className="text-muted-foreground">{listingData.contact.email}</p>
                    <p className="text-muted-foreground">{listingData.contact.phone}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ListingDetail;
