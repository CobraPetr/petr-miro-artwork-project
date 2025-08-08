
import { Layout } from "@/components/Layout";
import { ArtworkProvider } from "@/context/ArtworkContext";

const Index = () => {
  return (
    <ArtworkProvider>
      <Layout />
    </ArtworkProvider>
  );
};

export default Index;
