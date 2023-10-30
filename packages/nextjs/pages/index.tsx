import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Contributions } from "~~/components/Contributions";
import { HackerStreams } from "~~/components/HackerStreams";
import { StreamContract } from "~~/components/StreamContract";
import { useScaffoldContractRead, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type BuilderData = {
  cap: BigNumber;
  unlockedAmount: BigNumber;
  builderAddress: string;
};

const Home: NextPage = () => {
  const { address } = useAccount();

  const [builderList, setBuilderList] = useState<string[]>([]);

  const { data: allBuildersData, isLoading: isLoadingBuilderData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allBuildersData",
    args: [builderList],
  });

  const { data: withdrawEvents, isLoading: isLoadingWithdrawEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdraw",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const { data: addBuilderEvents, isLoading: isLoadingBuilderEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AddBuilder",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
  });

  useEffect(() => {
    if (addBuilderEvents && addBuilderEvents.length > 0) {
      const fetchedBuilderList = addBuilderEvents.map((event: any) => event.args.to);
      // remove duplicates
      const uniqueBuilderList = [...new Set(fetchedBuilderList)];
      setBuilderList(uniqueBuilderList);
    }
  }, [addBuilderEvents]);

  const amIAStreamedBuilder = allBuildersData?.some(
    (builderData: BuilderData) => builderData.builderAddress === address,
  );

  const title = "👑 Golden Age Cohort Stream";

  const desc_conent1 =
    "We're entering the Golden Age of Onchain Payments. With the proliferation of rollups, Account Abstraction, and other recent & upcoming advancements in the Ethereum ecosystem, it's finally becoming viable - and, increasingly, preferable - to conduct payments onchain. ";

  const desc_content2 =
    "We are rewarding up-and-coming devs for contributions to the ecosystem that help usher in & advance the Golden Age of Onchain Payments. Devs can submit projects, claim grant streams and showcase their work. ";

  const desc_content3 =
    'The aperture is broad: basically, "build cool shit for onchain payments". This could be building Account Abstraction-related infrastructure, bridging tools, peer-to-peer payments products, or even helping merchants accept crypto.';

  const desc = (
    <>
      <div className="pb-4">{desc_conent1}</div>
      <div className="pb-4">{desc_content2}</div>
      <div className="pb-4">{desc_content3}</div>

      {"Join this telegram to contribute:"}
    </>
  );

  const tgLink = "https://t.me/+Q6PKVKVA7oBmYmEx";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc_conent1 + desc_content2 + desc_content3} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc_conent1 + desc_content2 + desc_content3} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_VERCEL_URL || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10 mb-20 mx-auto font-grotesk gap-5">
        <div className="max-w-[42rem] m-auto w-[90%] bg-secondary px-8 py-4 rounded-2xl">
          <p className="font-bold text-left text-4xl leading-6 py-2">{title}</p>
          <Image src="/golden.png" alt="Title Image" width={300} height={300} className="mx-4" />
          <p>
            {desc}{" "}
            <a style={{ color: "white" }} href={tgLink}>
              {tgLink}
            </a>
          </p>
          <p>
            Chosen developers can submit their contributions, automatically claim grant streams, and showcase their work
            onchain.
          </p>
        </div>

        <div className="max-w-[42rem] m-auto w-[90%] bg-secondary rounded-2xl">
          <h2 className="font-bold text-2xl px-8 py-4 border-b-2">⏳ ETH Streams</h2>
          <div>
            <HackerStreams
              allBuildersData={allBuildersData}
              withdrawEvents={withdrawEvents}
              isLoadingBuilderData={isLoadingBuilderData}
              isLoadingBuilderEvents={isLoadingBuilderEvents}
            />
          </div>
          <h2 className="font-bold text-2xl px-8 py-4 border-b-2 bg-accent opacity-60">📑 Contract Details</h2>
          <div className="p-0 bg-accent rounded-b-2xl opacity-60">
            <StreamContract amIAStreamedBuilder={amIAStreamedBuilder} />
          </div>
        </div>

        <div className="max-w-[42rem] m-auto w-[90%] bg-secondary rounded-2xl">
          <h2 className="font-bold text-2xl px-8 py-4 border-b-2">Contributions</h2>
          <div className="p-0">
            <Contributions withdrawEvents={withdrawEvents} isLoadingWithdrawEvents={isLoadingWithdrawEvents} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
