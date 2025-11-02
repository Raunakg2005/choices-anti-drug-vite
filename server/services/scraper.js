import axios from 'axios';
import * as cheerio from 'cheerio';

// Scrape anti-drug resources from various sources
const scrapeResources = async () => {
  const resources = [];

  try {
    // Example: Scraping from AA Intergroup (similar to your Django scraper)
    const response = await axios.get('https://aa-intergroup.org/meetings/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    // Extract meeting information
    $('.css-46p1lt').each((index, element) => {
      if (index < 5) {
        const heading = $(element).find('.chakra-heading a');
        const link = heading.attr('href');
        const title = heading.text().trim();
        const paragraph = $(element).text().replace(/,/g, '').replace(/\[/g, '').replace(/\]/g, '').trim();

        if (link && title) {
          resources.push({
            title: title,
            link: link.startsWith('http') ? link : `https://aa-intergroup.org${link}`,
            description: paragraph,
            category: 'support-meetings',
            source: 'AA Intergroup'
          });
        }
      }
    });
  } catch (error) {
    console.log('Note: Unable to fetch live AA meetings data, using static resources instead.');
    // Continue with static resources even if scraping fails
  }

  // Add more static resources
  const staticResources = [
    {
      title: 'National Drug Helpline',
      link: 'https://www.drughelpline.org/',
      description: '24/7 confidential support for substance abuse and addiction',
      category: 'helpline',
      source: 'Drug Helpline'
    },
    {
      title: 'SAMHSA National Helpline',
      link: 'https://www.samhsa.gov/find-help/national-helpline',
      description: 'Free, confidential, 24/7 treatment referral and information service - 1-800-662-4357',
      category: 'helpline',
      source: 'SAMHSA'
    },
    {
      title: 'Narcotics Anonymous',
      link: 'https://www.na.org/',
      description: 'Support group for people recovering from drug addiction',
      category: 'support-group',
      source: 'NA'
    },
    {
      title: 'NIDA - National Institute on Drug Abuse',
      link: 'https://www.drugabuse.gov/',
      description: 'Research-based information on drugs and addiction',
      category: 'education',
      source: 'NIDA'
    },
    {
      title: 'Partnership to End Addiction',
      link: 'https://drugfree.org/',
      description: 'Resources for families affected by addiction',
      category: 'family-support',
      source: 'Partnership'
    }
  ];

  resources.push(...staticResources);
  return resources;
};

// Scrape educational videos
const scrapeVideos = () => {
  return [
    {
      title: 'Understanding Addiction',
      videoId: 'b2emgrRuMB0',
      source: 'YouTube',
      category: 'education'
    },
    {
      title: 'Recovery Stories',
      videoId: 'MrUqzUmEgIw',
      source: 'YouTube',
      category: 'inspiration'
    },
    {
      title: 'The Science of Addiction',
      videoId: 'bwZcPwlRRcc',
      source: 'YouTube',
      category: 'education'
    }
  ];
};

export { scrapeResources, scrapeVideos };
