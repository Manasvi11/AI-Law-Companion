export interface CountrySourceProfile {
  name: string;
  lawSources: string[];
  caseSources: string[];
}

export const COUNTRY_SOURCE_PROFILES: Record<string, CountrySourceProfile> = {
  US: {
    name: 'United States',
    lawSources: ['https://www.congress.gov/', 'https://www.law.cornell.edu/', 'https://www.usa.gov/'],
    caseSources: ['https://www.law.cornell.edu/', 'https://www.oyez.org/'],
  },
  GB: {
    name: 'United Kingdom',
    lawSources: ['https://www.legislation.gov.uk/', 'https://www.gov.uk/'],
    caseSources: ['https://www.bailii.org/', 'https://www.supremecourt.uk/decided-cases/'],
  },
  IN: {
    name: 'India',
    lawSources: ['https://www.indiacode.nic.in/', 'https://legislative.gov.in/', 'https://www.legalservicesindia.com/'],
    caseSources: ['https://main.sci.gov.in/', 'https://indiankanoon.org/'],
  },
  CA: {
    name: 'Canada',
    lawSources: ['https://laws-lois.justice.gc.ca/', 'https://www.canada.ca/'],
    caseSources: ['https://www.canlii.org/', 'https://decisions.scc-csc.ca/'],
  },
  AU: {
    name: 'Australia',
    lawSources: ['https://www.legislation.gov.au/', 'https://www.australia.gov.au/'],
    caseSources: ['https://www.austlii.edu.au/', 'https://www.hcourt.gov.au/cases'],
  },
  DE: {
    name: 'Germany',
    lawSources: ['https://www.gesetze-im-internet.de/', 'https://www.bmj.de/'],
    caseSources: ['https://www.bundesverfassungsgericht.de/', 'https://www.bundesgerichtshof.de/'],
  },
  FR: {
    name: 'France',
    lawSources: ['https://www.legifrance.gouv.fr/', 'https://www.service-public.fr/'],
    caseSources: ['https://www.courdecassation.fr/', 'https://www.conseil-constitutionnel.fr/'],
  },
  BR: {
    name: 'Brazil',
    lawSources: ['https://www4.planalto.gov.br/legislacao/', 'https://www.gov.br/'],
    caseSources: ['https://portal.stf.jus.br/', 'https://www.stj.jus.br/'],
  },
  MX: {
    name: 'Mexico',
    lawSources: ['https://www.diputados.gob.mx/LeyesBiblio/', 'https://www.gob.mx/'],
    caseSources: ['https://www.scjn.gob.mx/'],
  },
  JP: {
    name: 'Japan',
    lawSources: ['https://www.japaneselawtranslation.go.jp/', 'https://elaws.e-gov.go.jp/'],
    caseSources: ['https://www.courts.go.jp/'],
  },
  CN: {
    name: 'China',
    lawSources: ['https://www.npc.gov.cn/', 'https://english.www.gov.cn/'],
    caseSources: ['https://english.court.gov.cn/'],
  },
  NG: {
    name: 'Nigeria',
    lawSources: ['https://lawsofnigeria.placng.org/', 'https://www.nigeria.gov.ng/'],
    caseSources: ['https://supremecourt.gov.ng/'],
  },
  ZA: {
    name: 'South Africa',
    lawSources: ['https://www.gov.za/documents/acts', 'https://www.justice.gov.za/'],
    caseSources: ['https://www.saflii.org/', 'https://www.concourt.org.za/'],
  },
  KE: {
    name: 'Kenya',
    lawSources: ['https://www.kenyalaw.org/', 'https://www.judiciary.go.ke/'],
    caseSources: ['https://www.kenyalaw.org/', 'https://www.judiciary.go.ke/'],
  },
  PK: {
    name: 'Pakistan',
    lawSources: ['https://pakistancode.gov.pk/', 'https://molaw.gov.pk/'],
    caseSources: ['https://www.supremecourt.gov.pk/'],
  },
  BD: {
    name: 'Bangladesh',
    lawSources: ['http://bdlaws.minlaw.gov.bd/', 'https://minlaw.gov.bd/'],
    caseSources: ['https://www.supremecourt.gov.bd/'],
  },
  SG: {
    name: 'Singapore',
    lawSources: ['https://sso.agc.gov.sg/', 'https://www.mlaw.gov.sg/'],
    caseSources: ['https://www.elitigation.sg/gd/', 'https://www.judiciary.gov.sg/'],
  },
  AE: {
    name: 'United Arab Emirates',
    lawSources: ['https://uaelegislation.gov.ae/', 'https://u.ae/'],
    caseSources: ['https://www.moj.gov.ae/'],
  },
  SA: {
    name: 'Saudi Arabia',
    lawSources: ['https://laws.boe.gov.sa/', 'https://www.my.gov.sa/'],
    caseSources: ['https://www.moj.gov.sa/'],
  },
  ID: {
    name: 'Indonesia',
    lawSources: ['https://peraturan.go.id/', 'https://jdih.setneg.go.id/'],
    caseSources: ['https://putusan3.mahkamahagung.go.id/'],
  },
};

export function getCountrySourceProfile(countryCode: string): CountrySourceProfile | undefined {
  return COUNTRY_SOURCE_PROFILES[countryCode];
}
