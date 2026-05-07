import type { StructuredLegalResponse } from '@/types';
import { getCountrySourceProfile } from './country-sources';

function getCountryContext(country: string): string {
  const contexts: Record<string, string> = {
    US: 'In the US',
    IN: 'In India',
    GB: 'In the UK',
    CA: 'In Canada',
    AU: 'In Australia',
    NG: 'In Nigeria',
    ZA: 'In South Africa',
    KE: 'In Kenya',
    PK: 'In Pakistan',
    BD: 'In Bangladesh',
  };
  return contexts[country] || 'Where you live';
}

function applyCountrySources(response: StructuredLegalResponse, country: string, topic: string): StructuredLegalResponse {
  if (country !== 'IN') return response;

  const indiaSources: Record<string, Pick<StructuredLegalResponse, 'laws' | 'cases'>> = {
    default: {
      laws: [
        { name: 'Constitution of India - Fundamental Rights', description: 'Protects equality, liberty, and remedies before Indian courts', url: 'https://legislative.gov.in/constitution-of-india/' },
        { name: 'Code of Civil Procedure, 1908', description: 'Sets the process for filing and defending civil disputes in India', url: 'https://www.indiacode.nic.in/handle/123456789/2191?locale=en' },
      ],
      cases: [
        { title: 'Constitutional Remedies in India', description: 'Indian courts can enforce fundamental rights through writ remedies', url: 'https://main.sci.gov.in/' },
      ],
    },
    rent: {
      laws: [
        { name: 'Transfer of Property Act, 1882', description: 'Covers leases and landlord-tenant obligations for immovable property', url: 'https://www.indiacode.nic.in/handle/123456789/2338' },
        { name: 'State Rent Control Law', description: 'Rent, eviction, and deposit rules depend on the Indian state where the property is located', url: 'https://www.indiacode.nic.in/' },
        { name: 'Consumer Protection Act, 2019', description: 'May help when housing services or unfair practices are involved', url: 'https://www.indiacode.nic.in/handle/123456789/15256' },
      ],
      cases: [
        { title: 'Indian Rent and Eviction Case Law', description: 'Tenant protections and eviction rules depend heavily on state law and lease facts', url: 'https://indiankanoon.org/search/?formInput=tenant%20eviction%20security%20deposit' },
        { title: 'Lease Dispute Decisions', description: 'Indian courts look at the lease, notice, payment records, and possession facts', url: 'https://indiankanoon.org/search/?formInput=Transfer%20of%20Property%20Act%20lease%20tenant' },
      ],
    },
    employment: {
      laws: [
        { name: 'Industrial Relations Code, 2020', description: 'Covers industrial disputes, retrenchment, and worker-employer processes', url: 'https://www.indiacode.nic.in/handle/123456789/22040?locale=en' },
        { name: 'Code on Wages, 2019', description: 'Covers wage-related protections and payment rules in India', url: 'https://www.indiacode.nic.in/indiacode/handle/123456789/15793?view_type=browse' },
        { name: 'Employees Compensation Act, 1923', description: 'Covers compensation for certain work-related injuries', url: 'https://www.indiacode.nic.in/handle/123456789/19236?view_type=browse' },
      ],
      cases: [
        { title: 'Indian Employment Termination Decisions', description: 'Indian courts examine appointment terms, notice, misconduct process, and labour-law coverage', url: 'https://indiankanoon.org/search/?formInput=wrongful%20termination%20employment%20India' },
        { title: 'Industrial Dispute Decisions', description: 'Labour courts consider whether the worker and employer fall under industrial dispute protections', url: 'https://indiankanoon.org/search/?formInput=Industrial%20Disputes%20termination%20workman' },
      ],
    },
    accident: {
      laws: [
        { name: 'Motor Vehicles Act, 1988', description: 'Governs road accidents, insurance, and motor accident compensation claims in India', url: 'https://www.indiacode.nic.in/handle/123456789/1798?locale=en' },
        { name: 'Employees Compensation Act, 1923', description: 'Can apply when the injury happened during covered employment', url: 'https://www.indiacode.nic.in/handle/123456789/19236?view_type=browse' },
        { name: 'Limitation Act, 1963', description: 'Time limits can affect legal claims, so deadlines should be checked quickly', url: 'https://www.indiacode.nic.in/handle/123456789/1565' },
      ],
      cases: [
        { title: 'Motor Accident Claims Tribunal Decisions', description: 'Indian compensation depends on injury, income, fault, disability, and evidence', url: 'https://indiankanoon.org/search/?formInput=motor%20accident%20compensation%20tribunal' },
        { title: 'Negligent Driving Decisions', description: 'Courts examine police records, medical evidence, witnesses, and vehicle documents', url: 'https://indiankanoon.org/search/?formInput=rash%20negligent%20driving%20motor%20accident' },
      ],
    },
    document: {
      laws: [
        { name: 'Code of Civil Procedure, 1908', description: 'Civil notices and court papers usually follow CPC procedure', url: 'https://www.indiacode.nic.in/handle/123456789/2191?locale=en' },
        { name: 'Indian Evidence Act, 1872', description: 'Documents, proof, and evidence rules can matter if the issue reaches court', url: 'https://www.indiacode.nic.in/handle/123456789/2187' },
      ],
      cases: [
        { title: 'Indian Legal Notice Decisions', description: 'Courts look at service, deadlines, reply, and the legal basis of the notice', url: 'https://indiankanoon.org/search/?formInput=legal%20notice%20reply%20civil%20procedure' },
      ],
    },
  };

  const sources = indiaSources[topic] || indiaSources.default;
  return { ...response, laws: sources.laws, cases: sources.cases };
}

function localizeFallbackSources(response: StructuredLegalResponse, country: string): StructuredLegalResponse {
  const profile = getCountrySourceProfile(country);
  if (!profile || country === 'US' || country === 'IN') return response;

  return {
    ...response,
    laws: response.laws.map((law, index) => ({
      ...law,
      name: `${profile.name}: ${law.name}`,
      description: `${law.description} Check the selected country's legal source before relying on it.`,
      url: profile.lawSources[index % profile.lawSources.length],
    })),
    cases: response.cases.map((legalCase, index) => ({
      ...legalCase,
      title: `${profile.name}: ${legalCase.title}`,
      description: `${legalCase.description} Open this country's case-law source for local decisions.`,
      url: profile.caseSources[index % profile.caseSources.length],
    })),
  };
}

function filterByInterests(response: StructuredLegalResponse, interests: string[]): StructuredLegalResponse {
  if (!interests || interests.length === 0) return response;
  
  const result = { ...response };
  
  // If user only wants solutions, minimize other sections
  if (interests.includes('solutions') && !interests.includes('rights')) {
    result.rights = [];
  }
  if (interests.includes('solutions') && !interests.includes('laws')) {
    result.laws = [];
    result.cases = [];
  }
  
  return result;
}

export const DEMO_RESPONSES: Record<string, (country: string) => StructuredLegalResponse> = {
  default: (country: string) => {
    const ctx = getCountryContext(country);
    return {
      summary: `Hey, I hear you. Let me break this down so it's crystal clear. ${ctx}, you have protections in place — let's make sure you know how to use them.`,
      dos: [
        'Stay calm and write down everything that happened, with dates',
        'Keep all messages, emails, and documents as evidence',
        'Reach out to a local legal aid organization — many offer free help',
        'Know your rights before taking any next steps',
      ],
      donts: [
        "Don't sign anything you don't fully understand",
        "Don't ignore official letters or notices",
        "Don't make verbal agreements — get everything in writing",
        "Don't share details with the other party without advice",
      ],
      outcomes: [
        'The issue may be resolved through a simple conversation or letter',
        'You might need to file a formal complaint — legal aid can help',
        'Mediation is often faster and cheaper than going to court',
        'A lawyer can help you get the best outcome if it escalates',
      ],
      rights: [
        'You have the right to fair treatment under the law',
        'You can seek legal help regardless of your income',
        'You have the right to understand any legal process affecting you',
      ],
      laws: [
        { name: 'Fundamental Rights', description: 'Basic protections guaranteed to all citizens', url: 'https://www.law.cornell.edu/wex/fundamental_right' },
        { name: 'Civil Procedure', description: 'Rules that ensure fair handling of disputes', url: 'https://www.law.cornell.edu/wex/civil_procedure' },
      ],
      cases: [
        { title: 'Fair Process Precedents', description: 'Courts have consistently upheld the right to fair treatment', url: 'https://www.law.cornell.edu/wex/procedural_due_process' },
      ],
      disclaimer: 'This is general info to help you understand your situation. For advice specific to your case, talk to a local lawyer.',
    };
  },
  
  rent: (country: string) => {
    const ctx = getCountryContext(country);
    return {
      summary: `Rent issues are super common — you're not alone in this. ${ctx}, tenants have solid protections. Let me walk you through your options.`,
      dos: [
        'Read your lease carefully — know what you signed',
        'Document every issue with photos, dates, and descriptions',
        'Send repair requests in writing (email or text counts)',
        'Contact your local tenants union or housing authority',
        'Know the eviction laws in your area — landlords must follow strict rules',
      ],
      donts: [
        "Don't withhold rent without checking local laws first",
        "Don't move out suddenly without proper notice",
        "Don't ignore an eviction notice — respond right away",
        "Don't make major changes to the property without permission",
        "Don't agree to anything verbally — get it in writing",
      ],
      outcomes: [
        'Your landlord may be legally required to fix the issues',
        'You could be entitled to a rent reduction or compensation',
        'A housing mediator can often resolve things without court',
        'In serious cases, you may be able to break the lease penalty-free',
      ],
      rights: [
        `${ctx}, you're entitled to a safe, livable home`,
        'Your landlord must give notice before entering your space',
        'You cannot be discriminated against based on race, religion, gender, etc.',
        'Your security deposit must be returned with a clear breakdown of any deductions',
      ],
      laws: [
        { name: 'Landlord-Tenant Act', description: 'Sets the rules for what landlords and tenants can and cannot do', url: 'https://www.law.cornell.edu/wex/landlord-tenant_law' },
        { name: 'Fair Housing Laws', description: 'Protects against discrimination in housing', url: 'https://www.justice.gov/crt/fair-housing-act-1' },
        { name: 'Warranty of Habitability', description: 'Landlords must provide safe, livable conditions', url: 'https://www.law.cornell.edu/wex/implied_warranty_of_habitability' },
      ],
      cases: [
        { title: 'Habitability Standards', description: 'Courts have ruled that unsafe conditions violate tenant rights', url: 'https://www.law.cornell.edu/wex/implied_warranty_of_habitability' },
        { title: 'Retaliation Protections', description: 'Landlords cannot punish tenants for exercising their rights', url: 'https://www.law.cornell.edu/wex/retaliatory_eviction' },
      ],
      disclaimer: 'Tenant laws vary by city and state. This is general guidance — check your local laws or contact a tenant rights group.',
    };
  },
  
  employment: (country: string) => {
    const ctx = getCountryContext(country);
    return {
      summary: `Workplace issues are tough, but ${ctx}, employees have real protections. Let's figure out your best next move.`,
      dos: [
        'Write down every incident — dates, times, what was said, who was there',
        'Report the issue to HR in writing and keep a copy',
        'Save your employment contract, pay stubs, and any company policies',
        'Contact your labor department or an employment lawyer',
        'Look into whether you qualify for unemployment or other benefits',
      ],
      donts: [
        "Don't quit without exploring your options — it may hurt your case",
        "Don't sign a severance or settlement without reviewing it carefully",
        "Don't discuss your case on social media or with coworkers",
        "Don't miss deadlines for filing complaints",
        "Don't let retaliation scare you — it's often illegal",
      ],
      outcomes: [
        'HR may resolve the issue internally',
        'You can file a complaint with the labor board',
        'A settlement may be reached through mediation',
        'You could be entitled to compensation or reinstatement',
      ],
      rights: [
        `${ctx}, you have the right to a safe workplace free from harassment`,
        'You must be paid fairly, including overtime where applicable',
        'You cannot be fired for discriminatory reasons',
        'You have the right to report violations without retaliation',
      ],
      laws: [
        { name: 'Labor Protection Act', description: 'Covers fair wages, working conditions, and termination rules', url: 'https://www.law.cornell.edu/wex/employment_law' },
        { name: 'Anti-Discrimination Laws', description: 'Protects against unfair treatment based on protected characteristics', url: 'https://www.eeoc.gov/statutes/laws-enforced-eeoc' },
        { name: 'Whistleblower Protections', description: 'Shields employees who report illegal workplace practices', url: 'https://www.whistleblowers.gov/' },
      ],
      cases: [
        { title: 'Wrongful Termination Rulings', description: 'Courts have consistently protected employees fired for unlawful reasons', url: 'https://www.law.cornell.edu/wex/wrongful_termination' },
        { title: 'Hostile Work Environment', description: 'Legal standards for proving a workplace was truly hostile', url: 'https://www.eeoc.gov/harassment' },
      ],
      disclaimer: 'Employment laws vary by location. This is general info — an employment lawyer can give you advice for your specific case.',
    };
  },
  
  accident: (country: string) => {
    const ctx = getCountryContext(country);
    return {
      summary: `I'm really sorry this happened. First things first — take care of yourself. Then ${ctx}, here's what you need to know to protect your rights.`,
      dos: [
        'Get medical help immediately — your health comes first',
        'Call the police and get an official report filed',
        'Take photos of everything — injuries, vehicle damage, the scene',
        'Get contact info from witnesses and the other party',
        'Call your insurance company as soon as you can',
        'Keep every medical bill and receipt',
      ],
      donts: [
        "Don't admit fault or say sorry at the scene",
        "Don't sign anything from insurance without reading it fully",
        "Don't accept the first settlement offer without checking",
        "Don't post about the accident on social media",
        "Don't skip follow-up doctor visits",
      ],
      outcomes: [
        'Insurance should cover your medical bills and repairs',
        'You may be able to claim compensation for pain and suffering',
        'Settlement talks can take time — be patient',
        'If fault is disputed, a lawyer can help you get what you deserve',
      ],
      rights: [
        `${ctx}, you have the right to medical care and fair compensation`,
        'You can hire a lawyer — most work on contingency (no upfront cost)',
        'You have the right to a fair settlement from insurance',
        'You have a limited time to file a claim — act promptly',
      ],
      laws: [
        { name: 'Personal Injury Law', description: 'Allows compensation when someone else is at fault', url: 'https://www.law.cornell.edu/wex/personal_injury' },
        { name: 'Statute of Limitations', description: 'Time limit for filing a claim — varies by location', url: 'https://www.law.cornell.edu/wex/statute_of_limitations' },
        { name: 'Comparative Fault', description: 'How responsibility is shared between parties', url: 'https://www.law.cornell.edu/wex/comparative_negligence' },
      ],
      cases: [
        { title: 'Negligence Standards', description: 'How courts determine who was at fault', url: 'https://www.law.cornell.edu/wex/negligence' },
        { title: 'Compensation Guidelines', description: 'How damages and payouts are calculated', url: 'https://www.law.cornell.edu/wex/damages' },
      ],
      disclaimer: `Personal injury laws vary by location. Talk to a local lawyer quickly — there are time limits for filing claims in ${ctx}.`,
    };
  },
  
  document: (country: string) => {
    const ctx = getCountryContext(country);
    return {
      summary: `I've looked at your document. Here's what it's saying in plain language. ${ctx}, here's what you need to know.`,
      dos: [
        'Read through carefully — note any dates and deadlines',
        'Keep the original safe and take clear photos or scans',
        'If there are deadlines, mark them on your calendar right away',
        'Ask me about any specific words or sections you don\'t understand',
      ],
      donts: [
        "Don't ignore it — even if it looks scary or formal",
        "Don't sign anything you don't fully understand",
        "Don't miss any deadlines mentioned",
        "Don't throw away the original",
      ],
      outcomes: [
        'You may just need to respond or take a simple action',
        'There might be a hearing or meeting you need to attend',
        'Getting a lawyer to review it might be the smartest move',
      ],
      rights: [
        `${ctx}, you have the right to understand any document sent to you`,
        'You can request more time or clarification',
        'Legal aid services can help you understand it for free or low cost',
      ],
      laws: [
        { name: 'Right to Information', description: 'You can request clear explanations for documents affecting you', url: 'https://www.law.cornell.edu/wex/due_process' },
        { name: 'Due Process', description: 'Proper procedures must be followed', url: 'https://www.law.cornell.edu/wex/due_process' },
      ],
      cases: [
        { title: 'Document Review Standards', description: 'Courts recognize people need time to understand legal documents', url: 'https://www.law.cornell.edu/wex/due_process' },
      ],
      disclaimer: 'This is a general overview. Have a qualified attorney review the actual document for specific advice.',
    };
  },
};

export function getDemoResponse(input: string, country: string = '', interests: string[] = []): StructuredLegalResponse {
  const lower = input.toLowerCase();
  let response: StructuredLegalResponse;
  let topic = 'default';
  
  if (lower.includes('rent') || lower.includes('landlord') || lower.includes('tenant') || lower.includes('lease') || lower.includes('housing') || lower.includes('deposit')) {
    response = DEMO_RESPONSES.rent(country);
    topic = 'rent';
  } else if (lower.includes('job') || lower.includes('employ') || lower.includes('work') || lower.includes('boss') || lower.includes('fired') || lower.includes('office') || lower.includes('salary') || lower.includes('hr')) {
    response = DEMO_RESPONSES.employment(country);
    topic = 'employment';
  } else if (lower.includes('accident') || lower.includes('car') || lower.includes('crash') || lower.includes('injury') || lower.includes('hit') || lower.includes('insurance claim')) {
    response = DEMO_RESPONSES.accident(country);
    topic = 'accident';
  } else if (lower.includes('document') || lower.includes('notice') || lower.includes('letter') || lower.includes('paper')) {
    response = DEMO_RESPONSES.document(country);
    topic = 'document';
  } else {
    response = DEMO_RESPONSES.default(country);
  }
  
  return filterByInterests(localizeFallbackSources(applyCountrySources(response, country, topic), country), interests);
}
